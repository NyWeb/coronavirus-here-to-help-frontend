const randomInt = (maxN = 10) => Math.floor(Math.random() * maxN + 1);
const randomNullableBool = () => (Math.random() > 0.5 ? true : false);
const nullOrValue = (val) => (Math.random() > 0.5 ? null : val);

export class HelpRequestV4APIEntity {
    sample(arg = {}) {
        const Id = arg.Id || randomInt();
        const onBehalfFirstName = faker.name.firstName();
        const onBehalfLastName = faker.name.lastName();
        return Object.freeze({
            Id,
            ResidentId: arg.ResidentId || randomInt(),
            IsOnBehalf: arg.IsOnBehalf || randomNullableBool(),
            ConsentToCompleteOnBehalf: arg.ConsentToCompleteOnBehalf || randomNullableBool(),
            OnBehalfFirstName: arg.OnBehalfFirstName || nullOrValue(faker.name.firstName()),
            OnBehalfLastName: arg.OnBehalfLastName || nullOrValue(faker.name.lastName()),
            OnBehalfEmailAddress:
                arg.OnBehalfEmailAddress ||
                nullOrValue(faker.internet.email(onBehalfFirstName, onBehalfLastName)),
            OnBehalfContactNumber: arg.OnBehalfContactNumber || nullOrValue(randexp(/07\d{9}/)),
            RelationshipWithResident:
                arg.RelationshipWithResident || nullOrValue(faker.lorem.word()),
            GettingInTouchReason: arg.GettingInTouchReason || nullOrValue(faker.lorem.words(3)),
            HelpWithAccessingFood: arg.HelpWithAccessingFood || nullOrValue(randomNullableBool()),
            HelpWithAccessingSupermarketFood:
                arg.HelpWithAccessingSupermarketFood || randomNullableBool(),
            HelpWithCompletingNssForm: arg.HelpWithCompletingNssForm || randomNullableBool(),
            HelpWithShieldingGuidance: arg.HelpWithShieldingGuidance || randomNullableBool(),
            HelpWithNoNeedsIdentified: arg.HelpWithNoNeedsIdentified || randomNullableBool(),
            HelpWithAccessingMedicine: arg.HelpWithAccessingMedicine || randomNullableBool(),
            HelpWithAccessingOtherEssentials:
                arg.HelpWithAccessingOtherEssentials || randomNullableBool(),
            HelpWithDebtAndMoney: arg.HelpWithDebtAndMoney || randomNullableBool(),
            HelpWithHealth: arg.HelpWithHealth || randomNullableBool(),
            HelpWithMentalHealth: arg.HelpWithMentalHealth || randomNullableBool(),
            HelpWithAccessingInternet: arg.HelpWithAccessingInternet || randomNullableBool(),
            HelpWithHousing: arg.HelpWithHousing || randomNullableBool(),
            HelpWithJobsOrTraining: arg.HelpWithJobsOrTraining || randomNullableBool(),
            HelpWithChildrenAndSchools: arg.HelpWithChildrenAndSchools || randomNullableBool(),
            HelpWithDisabilities: arg.HelpWithDisabilities || randomNullableBool(),
            HelpWithSomethingElse: arg.HelpWithSomethingElse || randomNullableBool(),
            MedicineDeliveryHelpNeeded: arg.MedicineDeliveryHelpNeeded || randomNullableBool(),
            WhenIsMedicinesDelivered:
                arg.WhenIsMedicinesDelivered ||
                nullOrValue(Math.random() < 0.2 ? faker.date.weekday() : ''),
            UrgentEssentials:
                arg.UrgentEssentials ||
                nullOrValue(Math.random() < 0.2 ? faker.lorem.words(5) : ''),
            UrgentEssentialsAnythingElse:
                arg.UrgentEssentialsAnythingElse ||
                nullOrValue(Math.random() < 0.2 ? faker.lorem.words(5) : ''),
            CurrentSupport: arg.CurrentSupport || nullOrValue(faker.random.word()),
            CurrentSupportFeedback: arg.CurrentSupportFeedback || nullOrValue(faker.lorem.words(5)),
            DateTimeRecorded: arg.DateTimeRecorded || nullOrValue(faker.date.recent(40)),
            InitialCallbackCompleted: arg.InitialCallbackCompleted || randomNullableBool(),
            CallbackRequired:
                arg.CallbackRequired || Math.random() > 0.5 ? randomNullableBool() : true,
            CaseNotes: arg.CaseNotes || nullOrValue(nItems(3, faker.lorem.words).join(' | ')),
            AdviceNotes: arg.AdviceNotes || nullOrValue(faker.lorem.words()),
            HelpNeeded:
                arg.HelpNeeded ||
                nullOrValue(randexp(/Contact Tracing|Shielding|Welfare|Help Request/)),
            NhsCtasId: arg.NhsCtasId || nullOrValue(randexp(/[^\W_]{8}/)),
            AssignedTo:
                arg.AssignedTo || nullOrValue(`${faker.name.firstName()} ${faker.name.lastName()}`),
            HelpRequestCalls: [
                {
                    Id: 0,
                    HelpRequestId: 0,
                    CallType: 'string',
                    CallDirection: 'string',
                    CallOutcome: 'string',
                    CallDateTime: '2021-01-28T14:02:55.772Z',
                    CallHandler: 'string'
                }
            ]
        });
    }
}

