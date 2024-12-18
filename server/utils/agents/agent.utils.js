import { functionWrapper } from "../../std/wrappers.js";
import CustomError from "../../std/custom.error.js";
import { logger } from "../../logger.js";

import { v4 as uuidv4 } from "uuid";

import { Agent } from "../../models/agents/agent.model.js";
import { SupportedAgentTypes } from "../../config/agents/agent.config.js";
import {
    getAnalyzedProspectsCollection,
    getProspectsCollection,
} from "../../models/agents/analyzed.prospects.model.js";

const fileName = "Agent Utils";

// Add this function at the beginning of the file
function isValidAgentType(type) {
    return SupportedAgentTypes.includes(type);
}

// Create a new agent
async function _createAgent(
    { accountId, userId, name, description, type },
    { txid, logg, funcName }
) {
    logg.info(`started`);
    if (!accountId) throw `accountId is invalid`;
    if (!userId) throw `userId is invalid`;
    if (!name) throw `name is invalid`;
    if (!description) throw `description is invalid`;
    if (!type) throw `type is invalid`;
    if (!isValidAgentType(type))
        throw new CustomError(
            `Invalid agent type: ${type}`,
            fileName,
            funcName
        );

    const agentId = uuidv4();
    const agentObj = {
        _id: agentId,
        account: accountId,
        created_by: userId,
        name,
        description,
        type,
        status: "running: prospecting",
    };

    let agentDoc = await Agent.create(agentObj);
    logg.info(`agentDoc created: ${JSON.stringify(agentDoc)}`);

    logg.info(`ended`);
    return [agentDoc, null];
}

export const createAgent = functionWrapper(
    fileName,
    "createAgent",
    _createAgent
);

// Get an agent by ID
async function _getAgent(
    { accountId, userId, agentId },
    { txid, logg, funcName }
) {
    logg.info(`started`);
    if (!accountId) throw `accountId is invalid`;
    if (!userId) throw `userId is invalid`;
    if (!agentId) throw `agentId is invalid`;

    let agentDoc = await Agent.findOne({ _id: agentId, account: accountId });
    if (!agentDoc) {
        throw new CustomError(`Agent not found`, fileName, funcName);
    }

    logg.info(`ended`);
    return [agentDoc, null];
}

export const getAgent = functionWrapper(fileName, "getAgent", _getAgent);

// Update an existing agent
async function _updateAgent(
    { accountId, userId, agentId, name, description, type },
    { txid, logg, funcName }
) {
    logg.info(`started`);
    if (!accountId) throw `accountId is invalid`;
    if (!userId) throw `userId is invalid`;
    if (!agentId) throw `agentId is invalid`;
    if (!name) throw `name is invalid`;
    if (!description) throw `description is invalid`;
    if (!type) throw `type is invalid`;
    if (!isValidAgentType(type))
        throw new CustomError(
            `Invalid agent type: ${type}`,
            fileName,
            funcName
        );

    let agentDoc = await Agent.findOneAndUpdate(
        { _id: agentId, account: accountId },
        { name, description, type, updated_on: Date.now() },
        { new: true }
    );

    if (!agentDoc) {
        throw new CustomError(`Agent not found`, fileName, funcName);
    }

    logg.info(`agentDoc updated: ${JSON.stringify(agentDoc)}`);
    logg.info(`ended`);
    return [agentDoc, null];
}

export const updateAgent = functionWrapper(
    fileName,
    "updateAgent",
    _updateAgent
);

// Delete an agent
async function _deleteAgent(
    { accountId, userId, agentId },
    { txid, logg, funcName }
) {
    logg.info(`started`);
    if (!accountId) throw `accountId is invalid`;
    if (!userId) throw `userId is invalid`;
    if (!agentId) throw `agentId is invalid`;

    let agentDoc = await Agent.findOneAndDelete({
        _id: agentId,
        account: accountId,
    });
    if (!agentDoc) {
        throw new CustomError(`Agent not found`, fileName, funcName);
    }

    logg.info(`agentDoc deleted: ${JSON.stringify(agentDoc)}`);
    logg.info(`ended`);
    return [agentDoc, null];
}

export const deleteAgent = functionWrapper(
    fileName,
    "deleteAgent",
    _deleteAgent
);

// List all agents for an account
async function _listAgents({ accountId, userId }, { txid, logg, funcName }) {
    logg.info(`started`);
    if (!accountId) throw `accountId is invalid`;
    if (!userId) throw `userId is invalid`;

    let agents = await Agent.find({ account: accountId });
    logg.info(`agents fetched: ${agents.length}`);

    logg.info(`ended`);
    return [agents, null];
}

export const listAgents = functionWrapper(fileName, "listAgents", _listAgents);

async function getAnalyzedProspects() {
    const AnalyzedProspects = getAnalyzedProspectsCollection();
    const Prospects = getProspectsCollection();

    const analyzedProspects = await AnalyzedProspects.find({
        score: { $gte: 0.9, $lte: 0.95 },
    })
        .limit(40)
        .lean();

    return analyzedProspects;
}

async function getMatchingProspects(upIds) {
    const Prospects = getProspectsCollection();
    return await Prospects.find({ up_id: { $in: upIds } }).lean();
}

function combineTextArray(textArray, field) {
    return textArray
        .map((item) => {
            let text = item[field];
            if (!text.endsWith(".")) {
                text += ".";
            }
            return text + " ";
        })
        .join("")
        .trim();
}

function createProspectObject(prospect, analyzedProspect) {
    return {
        first_name: prospect.first_name,
        last_name: prospect.last_name,
        email: prospect.business_email,
        linkedin_url: prospect.linkedin_url,
        insights: combineTextArray(analyzedProspect.reasoning, "reason"),
        score: analyzedProspect.score * 100,
        job_title: prospect.job_title,
        company_name: prospect.company_name,
        references: combineTextArray(analyzedProspect.reasoning, "source_text"),
    };
}

async function _dailyProspectUpdates(
    { accountId, userId },
    { txid, logg, funcName }
) {
    logg.info(`started`);
    if (!accountId) throw `accountId is invalid`;
    if (!userId) throw `userId is invalid`;

    const analyzedProspects = await getAnalyzedProspects();
    logg.info(`analyzedProspects fetched: ${analyzedProspects.length}`);
    const upIds = analyzedProspects.map((p) => p.up_id);
    const prospects = await getMatchingProspects(upIds);

    const prospectMap = new Map(prospects.map((p) => [p.up_id, p]));

    const result = analyzedProspects
        .map((ap) => {
            const prospect = prospectMap.get(ap.up_id);
            if (!prospect || !prospect.linkedin_url) return null;
            return createProspectObject(prospect, ap);
        })
        .filter(Boolean);

    // Sort the data by descending order of score
    result.sort((a, b) => b.score - a.score);

    logg.info(`ended`);
    return [result, null];
}

export const dailyProspectUpdates = functionWrapper(
    fileName,
    "dailyProspectUpdates",
    _dailyProspectUpdates
);

// Archive an agent
async function _archiveAgent(
    { accountId, userId, agentId },
    { txid, logg, funcName }
) {
    logg.info(`started`);
    if (!accountId) throw `accountId is invalid`;
    if (!userId) throw `userId is invalid`;
    if (!agentId) throw `agentId is invalid`;

    let agentDoc = await Agent.findOneAndUpdate(
        { _id: agentId, account: accountId },
        { 
            is_archived: true, 
            status: 'archived',
            updated_on: Date.now() 
        },
        { new: true }
    );

    if (!agentDoc) {
        throw new CustomError(`Agent not found`, fileName, funcName);
    }

    logg.info(`agentDoc archived: ${JSON.stringify(agentDoc)}`);
    logg.info(`ended`);
    return [agentDoc, null];
}

export const archiveAgent = functionWrapper(
    fileName,
    "archiveAgent",
    _archiveAgent
);

// Pause an agent
async function _pauseAgent(
    { accountId, userId, agentId },
    { txid, logg, funcName }
) {
    logg.info(`started`);
    if (!accountId) throw `accountId is invalid`;
    if (!userId) throw `userId is invalid`;
    if (!agentId) throw `agentId is invalid`;

    let agentDoc = await Agent.findOneAndUpdate(
        { _id: agentId, account: accountId },
        { 
            status: 'paused',
            updated_on: Date.now() 
        },
        { new: true }
    );

    if (!agentDoc) {
        throw new CustomError(`Agent not found`, fileName, funcName);
    }

    logg.info(`agentDoc paused: ${JSON.stringify(agentDoc)}`);
    logg.info(`ended`);
    return [agentDoc, null];
}

export const pauseAgent = functionWrapper(
    fileName,
    "pauseAgent",
    _pauseAgent
);

async function _resumeAgent(
    { accountId, userId, agentId },
    { txid, logg, funcName }
) {
    logg.info(`started`);
    if (!accountId) throw `accountId is invalid`;
    if (!userId) throw `userId is invalid`;
    if (!agentId) throw `agentId is invalid`;

    let agentDoc = await Agent.findOneAndUpdate(
        { _id: agentId, account: accountId },
        { 
            status: 'running: prospecting',
            updated_on: Date.now() 
        },
        { new: true }
    );

    if (!agentDoc) {
        throw new CustomError(`Agent not found`, fileName, funcName);
    }

    logg.info(`agentDoc resumed: ${JSON.stringify(agentDoc)}`);
    logg.info(`ended`);
    return [agentDoc, null];
}

export const resumeAgent = functionWrapper(
    fileName,
    "resumeAgent",
    _resumeAgent
);