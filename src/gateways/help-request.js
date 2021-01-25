import { DefaultGateway } from '../gateways/default-gateway';

const ToHelpRequest = (hr) => {
    return {
        id: hr.Id,
        residentId: hr.ResidentId,
        assignedTo: hr.AssignedTo,
        adviceNotes: hr.AdviceNotes,
        callbackRequired: hr.CallbackRequired,
        currentSupport: hr.CurrentSupport,
        currentSupportFeedback: hr.CurrentSupportFeedback,
        dateTimeRecorded: hr.DateTimeRecorded,
        gettingInTouchReason: hr.GettingInTouchReason,
        helpNeeded: hr.HelpNeeded,
        helpWithAccessingFood: hr.HelpWithAccessingFood,
        helpWithAccessingInternet: hr.HelpWithAccessingInternet,
        helpWithAccessingMedicine: hr.HelpWithAccessingMedicine,
        hedicineDeliveryHelpNeeded: hr.MedicineDeliveryHelpNeeded,
        helpWithAccessingOtherEssentials: hr.HelpWithAccessingOtherEssentials,
        helpWithChildrenAndSchools: hr.HelpWithChildrenAndSchools,
        helpWithDebtAndMoney: hr.HelpWithDebtAndMoney,
        helpWithDisabilities: hr.HelpWithDisabilities,
        helpWithHealth: hr.HelpWithHealth,
        helpWithHousing: hr.HelpWithHousing,
        helpWithJobsOrTraining: hr.HelpWithJobsOrTraining,
        helpWithMentalHealth: hr.HelpWithMentalHealth,
        helpWithSomethingElse: hr.HelpWithSomethingElse,
        initialCallbackCompleted: hr.InitialCallbackCompleted,
        isOnBehalf: hr.IsOnBehalf,
        consentToCompleteOnBehalf: hr.ConsentToCompleteOnBehalf,
        onBehalfFirstName: hr.OnBehalfFirstName,
        onBehalfLastName: hr.OnBehalfLastName,
        onBehalfEmailAddress: hr.OnBehalfEmailAddress,
        onBehalfContactNumber: hr.OnBehalfContactNumber,
        recordStatus: hr.RecordStatus,
        relationshipWithResident: hr.RelationshipWithResident,
        urgentEssentials: hr.UrgentEssentials,
        urgentEssentialsAnythingElse: hr.UrgentEssentialsAnythingElse,
        whenIsMedicinesDelivered: hr.WhenIsMedicinesDelivered,
        rescheduledAt: hr.RescheduledAt,
        requestedDate: hr.RequestedDate,
        helpRequestCalls: ToCalls(hr.HelpRequestCalls),
        caseNotes: ToCaseNotes(hr.CaseNotes)
    };
};

const ToCalls = (calls) => {
    return calls?.map((call) => {
        return {
            id: call.Id,
            helpRequestId: call.HelpRequestId,
            callType: call.CallType,
            callDirection: call.CallDirection,
            callOutcome: call.CallOutcome,
            callDateTime: call.CallDateTime
        };
    });
};

const ToCaseNotes = (caseNotes) => {
    return caseNotes?.map((note) => {
        return {
            id: note.Id,
            caseNote: note.CaseNote,
            helpRequestId: note.HelpRequestId,
            residentId: note.ResidentId,
            createdAt: note.CreatedAt
        };
    });
};
export class HelpRequestGateway extends DefaultGateway {
    async getHelpRequest(residentId, requestId) {
        const response = await this.getFromUrl(`resident/${residentId}/helpRequests/${requestId}`);
        const helpRequest = ToHelpRequest(response);
        return helpRequest;
    }

    async getHelpRequests(residentId) {
        const response = await this.getFromUrl(`resident/${residentId}/helpRequests`);
        const helpRequests = response.map((x) => ToHelpRequest(x));
        return helpRequests;
    }

    async putHelpRequest(residentId, requestId, request_body) {
        const response = await this.putToUrl(
            `resident/${residentId}/helpRequests/${requestId}`,
            request_body
        );
        const helpRequest = ToHelpRequest(response);
        return helpRequest;
    }

    async patchHelpRequest(helpRequestId, requestBody) {
        return await this.patchToUrl(`api/v3/help-requests/${helpRequestId}`, requestBody);
    }
}
