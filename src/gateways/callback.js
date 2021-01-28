import { DefaultGateway } from '../gateways/default-gateway';

const isoDateToOtherDate = (dateString) => dateString.split('T')[0];
const joinNameParts = (obj) => [obj.FirstName, obj.LastName].join(' ');
const joinAddressParts = (obj) =>
    [obj.AddressFirstLine, obj.AddressSecondLine, obj.AddressThirdLine].join(', ');
const unsuccessfulCalls = (collection) =>
    collection.filter((c) => /refused_to_engage|wrong_number/.test(c.CallOutcome)).length;
const replaceIfShielding = (helpType) => helpType !== 'Shielding' ? helpType : 'CEV';

const ToCallbackList = (callbacks) => {
    return callbacks?.map((callback) => {
        return {
            residentName: joinNameParts(callback),
            residentId: callback.ResidentId,
            helpRequestId: callback.Id,
            address: joinAddressParts(callback),
            requestedDate: callback.DateTimeRecorded ? isoDateToOtherDate(callback.DateTimeRecorded):"", //remove this line from the component
            callType: replaceIfShielding(callback.HelpNeeded),
            unsuccessfulCallAttempts: unsuccessfulCalls(callback.HelpRequestCalls),
            followUpRequired: callback.CallbackRequired,
            assignedTo: callback.AssignedTo,
            rescheduledAt: callback.RescheduledAt
        };
    });
};

export class CallbackGateway extends DefaultGateway {
    async getCallback(queryParams) {
        const response = await this.getFromUrl(`v3/help-requests/callbacks`);
        const callbacksList = ToCallbackList(response);
        return callbacksList;
    }
}
