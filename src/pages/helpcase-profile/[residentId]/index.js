import React from 'react';
import Layout from '../../../components/layout';
import SupportTable from '../../../components/SupportTable/SupportTable';
import KeyInformation from '../../../components/KeyInformation/KeyInformation';
import Link from 'next/link';
import { Button } from '../../../components/Form';
import { ResidentGateway } from '../../../gateways/resident';
import { HelpRequestGateway } from '../../../gateways/help-request';
import CallHistory from '../../../components/CallHistory/CallHistory';
import CaseNotes  from "../../../components/CaseNotes/CaseNotes";
import { useState, useEffect } from 'react';
import { helpTypes } from "../../../helpers/constants";
import CaseNotesGateway from '../../../gateways/case-notes';

export default function HelpcaseProfile({ residentId }) {
    const [resident, setResident] = useState([]);
    const [helpRequests, setHelpRequests] = useState([]);
    const [caseNotes, setCaseNotes] = useState({
        "All":[],
        "Welfare Call":[],
        "Help Requesst":[],
        "Contact Tracing":[],
        "CEV":[]
    })

    const getResidentAndHelpRequests = async () => {
        try {
            const gateway = new ResidentGateway();
            const resident = await gateway.getResident(residentId);
            const hrGateway = new HelpRequestGateway();
            const helpRequests = await hrGateway.getHelpRequests(residentId);
            const caseNotesGateway = new CaseNotesGateway();
            const residentCaseNotes = await caseNotesGateway.getResidentCaseNotes(residentId)
            let categorisedCaseNotes = {"All":[],
                                        "Welfare Call":[],
                                        "Help Request":[],
                                        "Contact Tracing":[],
                                        "CEV":[]}

            residentCaseNotes.forEach(caseNote => {
                if(!caseNote) return
                caseNote.caseNote.forEach(note => {
                    let helpNeeded = helpRequests.filter(hr => hr.id == caseNote.helpRequestId);
                    // a hack to mitigate bad data
                    if (helpNeeded?.length > 0) {
                        helpNeeded = helpNeeded[0].helpNeeded;
                        note.helpNeeded = helpNeeded
                        if (note && note.helpNeeded && note.helpNeeded in categorisedCaseNotes) { categorisedCaseNotes[note.helpNeeded].push(note) }
                        categorisedCaseNotes['All'].push(note)
                    }
                });

                helpTypes.forEach(helpType => {
                    categorisedCaseNotes[helpType].sort((a, b) => new Date(b.noteDate) - new Date(a.noteDate))
                });
            });
            setCaseNotes(categorisedCaseNotes)
            setResident(resident);
            setHelpRequests(helpRequests);
        } catch (err) {
            console.log(`Error getting resident props with help request ID ${residentId}: ${err}`);
        }
    };
    function useEffectAsync(effect, inputs) {
        useEffect(() => {
            effect();
        }, inputs);
    }

    useEffectAsync(getResidentAndHelpRequests, []);


    const calls = [].concat
        .apply([], helpRequests.map(helpRequest => helpRequest.helpRequestCalls))
        .sort((a,b) => new Date(b.callDateTime) - new Date(a.callDateTime))

    return (
        resident && (
            <Layout>
                <div>
                    <a
                        href="/callback-list"
                        className="govuk-back-link"
                        style={{
                            marginTop: '-40px',
                            display: 'block',
                            borderBottom: 'none'
                        }}>
                        Back
                    </a>
                    <div className="govuk-grid-row">
                        <div className="govuk-grid-column-one-quarter-from-desktop">
                           {resident.id && <KeyInformation resident={resident} />}
                        </div>

                        <div className="govuk-grid-column-three-quarters-from-desktop">
                            <h1
                                className="govuk-heading-xl"
                                data-testid="resident-name_header">
                                {resident.firstName} {resident.lastName}
                            </h1>

                        <SupportTable helpRequests={helpRequests} />
                        <Link href="/add-support/[residentId]" as={`/add-support/${residentId}`}>
                            <Button data-testid='add-support-button'text="+ Add new support" />
                        </Link>

                            <hr />

                            <br />
                            <CallHistory calls={calls}  />
                            <CaseNotes caseNotes={caseNotes}/>
                        </div>
                    </div>
                </div>
            </Layout>
        )
    );
}

HelpcaseProfile.getInitialProps = async ({ query: { residentId }, req, res }) => {
    return {
        residentId
    };
};
