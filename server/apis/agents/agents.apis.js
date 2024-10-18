import { v4 as uuidv4 } from "uuid";
import { logger } from "../../logger.js";
import CustomError from "../../std/custom.error.js";
import * as AgentUtils from "../../utils/agents/agent.utils.js";

const fileName = "Agents APIs";

export async function createAgentApi(req, res, next) {
    const txid = req.id;
    const funcName = "createAgentApi";
    const logg = logger.child({ txid, funcName });
    logg.info(`started with body:` + JSON.stringify(req.body));
    logg.info(`started with query:` + JSON.stringify(req.query));

    let userId = req.user && req.user.userId ? req.user.userId : null;
    if (!userId) {
        logg.info(`ended unsuccessfully`);
        throw new CustomError(
            `Missing userId from decoded access token`,
            fileName,
            funcName
        );
    }

    let { account_id: accountId } = req.query;
    if (!accountId) {
        logg.info(`ended unsuccessfully`);
        throw new CustomError(
            `Missing account_id from query`,
            fileName,
            funcName
        );
    }

    let { name, description, type } = req.body;
    if (!name) {
        logg.info(`ended unsuccessfully`);
        throw new CustomError(`Missing name from body`, fileName, funcName);
    }
    if (!description) {
        logg.info(`ended unsuccessfully`);
        throw new CustomError(
            `Missing description from body`,
            fileName,
            funcName
        );
    }
    if (!type) {
        logg.info(`ended unsuccessfully`);
        throw new CustomError(`Missing type from body`, fileName, funcName);
    }

    let [agent, agentErr] = await AgentUtils.createAgent(
        { accountId, userId, name, description, type },
        { txid }
    );
    if (agentErr) {
        logg.info(`agentErr:` + agentErr);
        throw new CustomError(`Error creating agent`, fileName, funcName);
    }

    res.status(200).json({
        success: true,
        message: "Agent created successfully",
        result: agent,
    });
}

export async function getAgentApi(req, res, next) {
    const txid = req.id;
    const funcName = "getAgentApi";
    const logg = logger.child({ txid, funcName });
    logg.info(`started with body:` + JSON.stringify(req.body));
    logg.info(`started with query:` + JSON.stringify(req.query));

    let userId = req.user && req.user.userId ? req.user.userId : null;
    if (!userId) {
        logg.info(`ended unsuccessfully`);
        throw new CustomError(
            `Missing userId from decoded access token`,
            fileName,
            funcName
        );
    }

    let { account_id: accountId, agent_id: agentId } = req.query;
    if (!accountId) {
        logg.info(`ended unsuccessfully`);
        throw new CustomError(
            `Missing account_id from query`,
            fileName,
            funcName
        );
    }

    let [agent, agentErr] = await AgentUtils.getAgent(
        { accountId, userId, agentId },
        { txid }
    );
    if (agentErr) {
        logg.info(`agentErr:` + agentErr);
        throw new CustomError(`Error getting agent`, fileName, funcName);
    }

    res.status(200).json({
        success: true,
        message: "Agent fetched successfully",
        result: agent,
    });
}

export async function updateAgentApi(req, res, next) {
    const txid = req.id;
    const funcName = "updateAgentApi";
    const logg = logger.child({ txid, funcName });
    logg.info(`started with body:` + JSON.stringify(req.body));
    logg.info(`started with query:` + JSON.stringify(req.query));

    let userId = req.user && req.user.userId ? req.user.userId : null;
    if (!userId) {
        logg.info(`ended unsuccessfully`);
        throw new CustomError(
            `Missing userId from decoded access token`,
            fileName,
            funcName
        );
    }

    let { account_id: accountId, agent_id: agentId } = req.query;
    if (!accountId) {
        logg.info(`ended unsuccessfully`);
        throw new CustomError(
            `Missing account_id from query`,
            fileName,
            funcName
        );
    }

    let { name, description, type } = req.body;
    if (!name) {
        logg.info(`ended unsuccessfully`);
        throw new CustomError(`Missing name from body`, fileName, funcName);
    }
    if (!description) {
        logg.info(`ended unsuccessfully`);
        throw new CustomError(
            `Missing description from body`,
            fileName,
            funcName
        );
    }
    if (!type) {
        logg.info(`ended unsuccessfully`);
        throw new CustomError(`Missing type from body`, fileName, funcName);
    }

    let [agent, agentErr] = await AgentUtils.updateAgent(
        { accountId, userId, agentId, name, description, type },
        { txid }
    );

    if (agentErr) {
        logg.info(`agentErr:` + agentErr);
        throw new CustomError(`Error updating agent`, fileName, funcName);
    }

    res.status(200).json({
        success: true,
        message: "Agent updated successfully",
        result: agent,
    });
}

export async function deleteAgentApi(req, res, next) {
    const txid = req.id;
    const funcName = "deleteAgentApi";
    const logg = logger.child({ txid, funcName });
    logg.info(`started with body:` + JSON.stringify(req.body));
    logg.info(`started with query:` + JSON.stringify(req.query));

    let userId = req.user && req.user.userId ? req.user.userId : null;
    if (!userId) {
        logg.info(`ended unsuccessfully`);
        throw new CustomError(
            `Missing userId from decoded access token`,
            fileName,
            funcName
        );
    }

    let { account_id: accountId, agent_id: agentId } = req.query;
    if (!accountId) {
        logg.info(`ended unsuccessfully`);
        throw new CustomError(
            `Missing account_id from query`,
            fileName,
            funcName
        );
    }

    let [agent, agentErr] = await AgentUtils.deleteAgent(
        { accountId, userId, agentId },
        { txid }
    );
    if (agentErr) {
        logg.info(`agentErr:` + agentErr);
        throw new CustomError(`Error deleting agent`, fileName, funcName);
    }

    res.status(200).json({
        success: true,
        message: "Agent deleted successfully",
    });
}

export async function listAgentsApi(req, res, next) {
    const txid = req.id;
    const funcName = "listAgentsApi";
    const logg = logger.child({ txid, funcName });
    logg.info(`started with body:` + JSON.stringify(req.body));
    logg.info(`started with query:` + JSON.stringify(req.query));

    let userId = req.user && req.user.userId ? req.user.userId : null;
    if (!userId) {
        logg.info(`ended unsuccessfully`);
        throw new CustomError(
            `Missing userId from decoded access token`,
            fileName,
            funcName
        );
    }

    let { account_id: accountId } = req.query;
    if (!accountId) {
        logg.info(`ended unsuccessfully`);
        throw new CustomError(
            `Missing account_id from query`,
            fileName,
            funcName
        );
    }

    let [agents, agentsErr] = await AgentUtils.listAgents(
        { accountId, userId },
        { txid }
    );
    if (agentsErr) {
        logg.info(`agentsErr:` + agentsErr);
        throw new CustomError(`Error listing agents`, fileName, funcName);
    }

    res.status(200).json({
        success: true,
        message: "Agents fetched successfully",
        result: agents,
    });
}

export async function dailyProspectUpdatesApi(req, res, next) {
    const txid = req.id;
    const funcName = "dailyProspectUpdatesApi";
    const logg = logger.child({ txid, funcName });
    logg.info(`started with body:` + JSON.stringify(req.body));
    logg.info(`started with query:` + JSON.stringify(req.query));

    let userId = req.user && req.user.userId ? req.user.userId : null;
    if (!userId) {
        logg.info(`ended unsuccessfully`);
        throw new CustomError(
            `Missing userId from decoded access token`,
            fileName,
            funcName
        );
    }

    let { account_id: accountId } = req.query;
    if (!accountId) {
        logg.info(`ended unsuccessfully`);
        throw new CustomError(
            `Missing account_id from query`,
            fileName,
            funcName
        );
    }

    let [result, resultErr] = await AgentUtils.dailyProspectUpdates(
        { accountId, userId },
        { txid }
    );
    if (resultErr) {
        logg.info(`resultErr:` + resultErr);
        throw new CustomError(
            `Error getting daily prospect updates`,
            fileName,
            funcName
        );
    }

    /*
    * Sample response: 
    {
        "success": true,
        "message": "Daily prospect updates fetched successfully",
        "result": [
            {
                first_name: "John",
                last_name: "Doe",
                email: "john.doe@example.com",
                linkedin_url: "https://www.linkedin.com/in/john-doe-1234567890",
                insights: "Insights about John Doe",
            },
            {
                first_name: "Jane",
                last_name: "Doe",
                email: "jane.doe@example.com",
                linkedin_url: "https://www.linkedin.com/in/jane-doe-1234567890",
                insights: "Insights about Jane Doe",
            },
        ]
    }
    */

    res.status(200).json({
        success: true,
        message: "Daily prospect updates fetched successfully",
        result: result,
    });
}