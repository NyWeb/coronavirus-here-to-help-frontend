import { isLocalURL } from "next/dist/next-server/lib/router/router";
import Link from "next/link";
import { callOutcomes, CEV } from "../../helpers/constants";

export default function SupportTable({helpRequests}) {

	return (
		<>
			<div className="govuk-tabs" data-module="govuk-tabs">
				<ul className="govuk-tabs__list">
					<li className="govuk-tabs__list-item govuk-tabs__list-item--selected">
						<a className="govuk-tabs__tab" href="#past-day">
							Support Requested
						</a>
					</li>
					<li className="govuk-tabs__list-item">
						<a className="govuk-tabs__tab" href="#past-week">
							Support Received
						</a>
					</li>
				</ul>
				<div className="govuk-tabs__panel" id="past-day">
					<table className="govuk-table">
						<thead className="govuk-table__head">
							<tr className="govuk-table__row">
								<th scope="col" className="govuk-table__header">Type</th>
								<th scope="col" className="govuk-table__header">Action required</th>
								<th scope="col" className="govuk-table__header">Call attempts</th>
								<th scope="col" className="govuk-table__header"></th>
							</tr>
						</thead>
						<tbody className="govuk-table__body">
							{helpRequests.map((hr) => {
								let latestCallOutcome 
								if(hr.callbackRequired == true){
									if(hr.helpRequestCalls.length > 0){
										let latestCallOutcomeArray = []
										if(hr.helpRequestCalls[hr.helpRequestCalls.length-1].callOutcome && hr.helpRequestCalls[hr.helpRequestCalls.length-1].callOutcome.includes(",")){
											let callOutcomesList = hr.helpRequestCalls[hr.helpRequestCalls.length-1].callOutcome.split(",")
											callOutcomesList.forEach(callOutcome => {
												if(callOutcomes[callOutcome]){
													latestCallOutcomeArray.push(" "+callOutcomes[callOutcome]) 
												}else {
													latestCallOutcomeArray.push(callOutcome) 
												}
											})
										}else {
											latestCallOutcomeArray = [callOutcomes[hr.helpRequestCalls[hr.helpRequestCalls.length-1].callOutcome]] || [hr.helpRequestCalls[hr.helpRequestCalls.length-1].callOutcome]
										}
										latestCallOutcome = latestCallOutcomeArray.join(",")
									}else if(hr.helpNeeded.toLowerCase() == 'contact tracing' || hr.helpNeeded == CEV){
										latestCallOutcome = 'Call required'
									}
									else{
										latestCallOutcome = 'Followup required'
									}
									return (	<tr className="govuk-table__row">
									<td className="govuk-table__cell">{hr.helpNeeded}</td>
									<td className="govuk-table__cell">{latestCallOutcome}</td>
									<td className="govuk-table__cell">{hr.calls}</td>
									<td className="govuk-table__cell"><Link
												href="/helpcase-profile/[resident_id]/manage-request/[help_request]"
												as={`/helpcase-profile/${hr.residentId}/manage-request/${hr.id}`}>View</Link></td>
								</tr>)
								}
							})} 
						</tbody>
					</table>
				</div>
				<div className="govuk-tabs__panel govuk-tabs__panel--hidden" id="past-week">
					<table className="govuk-table">
						<thead className="govuk-table__head">
							<tr className="govuk-table__row">
								<th scope="col" className="govuk-table__header">Type</th>
								<th scope="col" className="govuk-table__header">Total completed calls</th>
								<th scope="col" className="govuk-table__header"></th>
							</tr>
						</thead>
						<tbody className="govuk-table__body">
							{helpRequests.map((hr) => {
								hr.totalCompletedCalls = 0
								if(hr.callbackRequired == false){
									if(hr.helpRequestCalls){
										hr.helpRequestCalls.forEach(call => {
											if(call.callOutcome && call.callOutcome.toLowerCase().includes('callback_complete')){
												hr.totalCompletedCalls += 1
											}
										});
									}
									return (	<tr className="govuk-table__row">
									<td className="govuk-table__cell">{hr.helpNeeded}</td>
									<td className="govuk-table__cell">{hr.totalCompletedCalls}</td>
									<td className="govuk-table__cell"><Link
												href="/helpcase-profile/[resident_id]/manage-request/[help_request]"
												as={`/helpcase-profile/${hr.residentId}/manage-request/${hr.id}`}>View</Link></td>
								</tr>)
								}
							})} 
						</tbody>
					</table>

				</div>

			</div>
		</>
	
	);
}
