import mongoose from "mongoose";

const Schema = mongoose.Schema;

const SequenceSchema = new Schema({
    _id: String,
    name: String,
    account: { type: Schema.Types.ObjectId, ref: "account" },
    created_by: { type: Schema.Types.ObjectId, ref: "User" },

    conversation: { type: String, ref: "qai.conversation" },
    uploaded_file_name: String,

    status: String,

    /*
     * Added 'activities' on 23rd July 2024
     * Initially this will be empty.
     * When prospects are generated by AI server, we will add object {type:"prospects_added", time: DateIsoString, txid} in this array.
     * If we were to add additional prospects, we will add object {type:"prospects_added", time: DateIsoString, txid, tag: string} again.
     *  - This is not yet implemented. But we have made provision for this now, by making this an array.
     */
    activities: [],

    prospect_verify_data: {},

    /*
     * Added 'default_timezone' on 16th July 2024
     * This is the default timezone of the sequence which is used when we need to reschedule message sending time for any prospect.
     */
    default_timezone: String,

    created_on: { type: Date, default: Date.now },
    updated_on: { type: Date, default: Date.now },
});

export const SequenceModel = mongoose.model(
    "sequence",
    SequenceSchema,
    "sequence"
);
