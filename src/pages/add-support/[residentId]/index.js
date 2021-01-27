import React, { useEffect, useState } from "react";
import Layout from "../../../components/layout";
import { Checkbox, RadioButton, Button } from "../../../components/Form";
import KeyInformation from "../../../components/KeyInformation/KeyInformation";
import Link from "next/link";
import { HelpRequestCallGateway } from '../../../gateways/help-request-call';
import { ResidentGateway } from '../../../gateways/resident';
import { HelpRequestGateway } from '../../../gateways/help-request';
import {unsafeExtractUser} from '../../../helpers/auth';

import { useRouter } from "next/router";

export default function addSupportPage({residentId}) {
	const [callMade, setCallMade] = useState(null);
	const [callOutcome, setCallOutcome] = useState("");
	const [followUpRequired, setFollowupRequired] = useState("")
	const [helpNeeded, setHelpNeeded] = useState("")
	const [callDirection, setCallDirection] = useState("")
	const [callOutcomeValues, setCallOutcomeValues] = useState("")
	const [errors, setErrors] = useState({
			CallbackRequired: null,
			HelpNeeded: null,
			CallDirection: null,
			CallOutcome: null,
			CallHandler: null
	})
	const router = useRouter()
	const [resident, setResident] = useState({})
	const [user, setUser] = useState({})

	const [errorsExist, setErrorsExist] = useState(null)
	const retreiveResidentAndUser = async ( ) => {
		const gateway = new ResidentGateway();
		const resident = await gateway.getResident(residentId);
		setResident(resident)
		const user = unsafeExtractUser()
		setUser(user)
	}

	useEffect(async () => {
		await retreiveResidentAndUser()
	}, [])

	const spokeToResidentCallOutcomes = [
		"Callback complete",
		"Refused to engage",
		"Call rescheduled",
	];
	const noAnswerCallOutcomes = [ 
		"Voicemail left",
		"Wrong number",
		"No answer machine",
	];
	const callTypes = [
		"Contact Tracing",
		"CEV",
		"Welfare Call",
		"Help Request",
	];
	const followupRequired = [
		"Yes", 
		"No"
	];
	const whoMadeInitialContact = [
		"I called the resident",
		"The resident called me",
	];


	const callBackFunction = value => {
		if(value=='Yes' || value == 'No'){
			console.log(value)
			setFollowupRequired(value)
		}
		if(callTypes.includes(value)){
			setHelpNeeded(value)
		}
	
	}
	
	const CallDirectionFunction = value => {
		if(value == whoMadeInitialContact[0]){
			setCallDirection("Outbound")
		}
		if(value == whoMadeInitialContact[1]){
			setCallDirection("Inbound")
		}
	}
	const updateCallMadeAndCallOutcomeValues = async value => {
		setCallOutcome(value)
		setCallOutcomeValues('')
	}

	const onCheckboxChangeUpdate = (value) => {
		if(callOutcomeValues.includes(value)) {
			const callOutcomeArray = callOutcomeValues.split();
			let newCallOutcomesValues = callOutcomeArray.filter(callOutcomeValue => callOutcomeValue != value)
			const callOutcomeString = newCallOutcomesValues.join()
			setCallOutcomeValues(callOutcomeString)
		}
		else{
			if(!callOutcomeValues){
				const newCallOutcomesValues = callOutcomeValues.concat(value)
				setCallOutcomeValues(newCallOutcomesValues)
			}else {
				const newCallOutcomesValues = callOutcomeValues.concat(','+value)
				setCallOutcomeValues(newCallOutcomesValues)
			}
		}
	}
	const handleUpdate = async (event) => {
		event.preventDefault();

		let callbackRequired = (followUpRequired == "Yes") ? true : false
		let initialCallbackCompleted = (followUpRequired == "Yes") ? false : true

		const validationFields = [callbackRequired, helpNeeded, callDirection]
		validationFields.forEach(validationField => {
			if(!validationField) {
				let tempErrors = errors
				tempErrors.validationField = true
				setErrors(tempErrors)
			}
		});

		if(callOutcomeValues.length < 1) {
			let tempErrors = errors
			tempErrors.callOutcomeValues = true
			setErrors(tempErrors)
		}

		let helpRequestObject = {
			ResidentId: residentId,
			CallbackRequired: callbackRequired,
			InitialCallbackCompleted: initialCallbackCompleted,
			DateTimeRecorded: new Date(),
			HelpNeeded: helpNeeded
		}

		let callRequestObject = {
			CallType: helpNeeded,
			CallDirection: callDirection,
			CallOutcome: callOutcomeValues,
			CallDateTime: new Date(),
			CallHandler: user.name
		}
		
		if(callMade==true){
			if(!callbackRequired || !helpNeeded|| !callDirection || callOutcomeValues.length < 1 ){
				setErrorsExist(true)
			}else {
				try{
					let helpRequestGateway = new HelpRequestGateway()
					let helpRequestId = await helpRequestGateway.postHelpRequest(residentId,  JSON.stringify(helpRequestObject));
					
					let helpRequestCallGateway = new HelpRequestCallGateway()
					let helpRequestCallId  = await helpRequestCallGateway.postHelpRequestCall(helpRequestId, JSON.stringify(callRequestObject))

					router.push(`/helpcase-profile/${residentId}`)
				} catch(err){
					console.log("Add support error", err)
				}
			}
		}

		if(callMade == false){
			if(!callbackRequired || !helpNeeded){
				setErrorsExist(true)
		 	}else {
			 try{
				 let helpRequestGateway = new HelpRequestGateway()
				 let helpRequestId = await helpRequestGateway.postHelpRequest(residentId,  JSON.stringify(helpRequestObject));
				 
				 router.push(`/helpcase-profile/${residentId}`)
				} catch(err){
				 console.log("Add support error", err)
				}
			}
		} 

		if(!callMade) {
			setErrorsExist(true)
		}
	}

	const backHref = `/helpcase-profile/${residentId}`
	return (
		<Layout>
			<div>
				<Link href= {backHref}>
					<a href="#" class="govuk-back-link">Back</a>
				</Link>
				<div class="govuk-grid-row">
					<div class="govuk-grid-column-one-quarter-from-desktop sticky-magic">
						<KeyInformation resident={resident}/>
					</div>
					<div class="govuk-grid-column-three-quarters-from-desktop">
					{errorsExist && <div class="govuk-error-summary" aria-labelledby="error-summary-title" role="alert" tabindex="-1" data-module="govuk-error-summary">
							<h2 class="govuk-error-summary__title" id="error-summary-title">
								There is a problem
							</h2>
							<div class="govuk-error-summary__body">
								<ul class="govuk-list govuk-error-summary__list">
									<li>
										<a href="#">You have not completed the form</a>
									</li>
								</ul>
							</div>
						</div>}
						<h1 class="govuk-heading-xl" style={{ marginTop: "0px", marginBottom: "40px" }}> {resident.firstName} {resident.lastName}
						</h1>
						<form >
							<div>
								<div class="govuk-grid-column">
									<div class="govuk-form-group lbh-form-group">
									<div>	
								<div class="govuk-grid-column">	
									<div class="govuk-form-group lbh-form-group">	
										<fieldset class="govuk-fieldset">	
											<legend class="govuk-fieldset__legend mandatoryQuestion"> Call type required</legend>	
											<br />	
											<RadioButton radioButtonItems={callTypes} name="HelpNeeded" onSelectOption = {callBackFunction} />	
										</fieldset>	
									</div>	
								</div>	
							</div>
							<br/>
										<fieldset class="govuk-fieldset">
											<legend class="govuk-fieldset__legend mandatoryQuestion"> Do you need to log new call details? </legend>
											<br />
											<div class="govuk-radios  lbh-radios govuk-radios--conditional" data-module="govuk-radios">
												<div class="govuk-radios__item">
													<input
														class="govuk-radios__input"
														id="CallMade"
														name="CallMade"
														type="radio"
														value="yes"
														onChange = { () => { setCallMade(true)}}
														aria-controls="conditional-CallMade"
														aria-expanded="false"
													/>
													<label class="govuk-label govuk-radios__label" for="CallMade"> Yes </label>
												</div>
												{callMade &&
													<div class="govuk-radios__conditional govuk-radios__conditional--hidden" id="conditional-CallMade">
														<div class="govuk-form-group lbh-form-group">
															<fieldset class="govuk-fieldset">
																<legend class="govuk-fieldset__legend mandatoryQuestion">Did you speak to a resident?</legend>
																<div class="govuk-radios govuk-radios--inline lbh-radios govuk-radios--conditional" data-module="govuk-radios">
																	<div class="govuk-radios__item">
																		<input
																			class="govuk-radios__input"
																			id="CallDetail"
																			name="CallDetail"
																			type="radio"
																			value="spoke_to_resident"
																			onChange = {() => {updateCallMadeAndCallOutcomeValues("spoke to resident")}}
																			aria-controls="conditional-CallDetail"
																			aria-expanded="false"
																		/>
																		<label class="govuk-label govuk-radios__label" for="CallDetail">Yes - spoke to resident</label>
																	</div>
																	{callOutcome =="spoke to resident" && 
																		<div class="govuk-radios__conditional govuk-radios__conditional--hidden" id="conditional-CallDetail">
																			<div>
																				<div class="display-spoke-to-resident">
																					<div class="govuk-form-group lbh-form-group">
																						<span id="CallOutcome-hint" class="govuk-hint  lbh-hint">Select a call outcome</span>
																						{spokeToResidentCallOutcomes.map((spokeToResidentCallOutcome) => {
																								return (
																									<Checkbox 
																										id={spokeToResidentCallOutcome} 
																										name="spokeToResidentCallOutcome"
																										type="checkbox"
																										value={spokeToResidentCallOutcome}
																										label={spokeToResidentCallOutcome}
																										aria-describedby="CallOutcome-hint"
																										onCheckboxChange={onCheckboxChangeUpdate}>
																									</Checkbox>
																								);
																						})}
																					</div>
																					<div class="display-call-attempted"></div>
																				</div>
																			</div>
																		</div>
																	}
																	<div class="govuk-radios__item">
																		<input
																			class="govuk-radios__input"
																			id="CallDetail-2"
																			name="CallDetail"
																			type="radio"
																			value="call_attempted"
																			onChange= { () => {updateCallMadeAndCallOutcomeValues("call attempted")}}
																			aria-controls="conditional-CallDetail-2"
																			aria-expanded="false"
																		/>
																		<label class="govuk-label govuk-radios__label" for="CallDetail-2">
																			No - call attempted
																		</label>
																	</div>
																	{callOutcome  =="call attempted" && 
																		<div class="govuk-radios__conditional govuk-radios__conditional--hidden" id="conditional-CallDetail-2">
																			<div class="display-call-attempted">
																				<div class="govuk-form-group lbh-form-group">
																					<span id="CallOutcome-hint" class="govuk-hint  lbh-hint"> Select a call outcome </span>
																					{noAnswerCallOutcomes.map((noAnswerCallOutcome) => {
																							return (
																								<Checkbox 
																								id={noAnswerCallOutcome}
																								name="noAnswerCallOutcome" 
																								type="checkbox"
																								value={noAnswerCallOutcome} 
																								label={noAnswerCallOutcome}
																								onCheckboxChange={onCheckboxChangeUpdate}
																								aria-describedby="CallOutcome-hint">

																								</Checkbox>
																							);
																						})}
																				</div>
																			</div>
																	</div>}
																</div>
															</fieldset>
														</div>

														<div class="govuk-form-group lbh-form-group">
														<fieldset class="govuk-fieldset">
															<legend class="govuk-fieldset__legend mandatoryQuestion"> Who made the call today? </legend>
															<RadioButton radioButtonItems={whoMadeInitialContact} name="InitialContact" onSelectOption={CallDirectionFunction} />
														</fieldset>
													</div>
													</div>
												}
												<div class="govuk-radios__item">
													<input
														class="govuk-radios__input"
														id="CallMade-2"
														name="CallMade"
														type="radio"
														value="no"
														onChange = { () => setCallMade(false)}
													/>
													<label class="govuk-label govuk-radios__label" for="CallMade-2">No</label>
												</div>
											</div>
										</fieldset>
									</div>
								</div>
							</div>
							
							{/* <hr class="govuk-section-break govuk-section-break--m govuk-section-break" />
							<h2 class="govuk-heading-l">Case notes:</h2>
							<h3 class="govuk-heading-m">
								Add a new case note (optional):
							</h3>
							<div class="govuk-form-group">
								<span id="NewCaseNote-hint" class="govuk-hint  lbh-hint"></span>
								<textarea
									class="govuk-textarea  lbh-textarea"
									id="NewCaseNote"
									name="NewCaseNote"
									rows="5"
									onChange = {(e) => {setCaseNotes(e.target.value)}}
									aria-describedby="NewCaseNote-hint">
								</textarea>
							</div> */}
							<br></br>
							<div class="govuk-grid-column">
									<div class="govuk-form-group lbh-form-group">
										<fieldset class="govuk-fieldset">
											<legend class="govuk-fieldset__legend mandatoryQuestion">Follow-up required?</legend>
											<br />
											<RadioButton radioButtonItems={followupRequired} name="FollowUpRequired" optionalClass = "govuk-radios--inline" onSelectOption = {callBackFunction}/>
										</fieldset>
									</div>
								</div>
							<div id="btn-bottom-panel">
								<div class="govuk-grid-column">
									<Button text="Update" addClass="govuk-!-margin-right-1" onClick={(event)=> { handleUpdate(event)}}/>
								<Link href={backHref}>
									<Button text="Cancel" addClass="govuk-button--secondary"/>
								</Link>
								</div>
							</div>
						</form>
						{/* <CaseNotes /> */}
					</div>
				</div>
			</div>
		</Layout>
	);
}

addSupportPage.getInitialProps = async ({ query: { residentId }, req, res }) => {
    try {
        return {
            residentId,
        };
    } catch (err) {
        console.log(`Error getting resident props with help request ID ${residentId}: ${err}`);
    }
};