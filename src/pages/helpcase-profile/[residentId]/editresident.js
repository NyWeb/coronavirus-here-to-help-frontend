import React from 'react';
import Layout from '../../../components/layout';
import KeyInformation from '../../../components/KeyInformation/KeyInformation';
import { ResidentGateway } from '../../../gateways/resident';
import { useState, useEffect } from 'react';
import { Button, Address } from '../../../components/Form';
import EditResidentBioForm from '../../../components/EditResidentBioForm/EditResidentBioForm';
import CaseNotes from '../../../components/CaseNotes/CaseNotes';
import Banner from '../../../components/Banner';
import Link from 'next/link';

export default function EditResident({ residentId }) {
    const [resident, setResident] = useState([]);
    const [updatedResident, setUpdatedResident] = useState({});
    const [errorsExist, setErrorsExist] = useState(false);

    const handleEditResident = async (id, value) => {
        setUpdatedResident({ ...updatedResident, [id]: value })
        console.log("updated resident", updatedResident);
    };

    const handleEditAddress = async (object) => {
        setUpdatedResident({ ...updatedResident, ...object })
        console.log("updated resident", updatedResident);
    };

    const checkForErrors = () => {
        console.log("first name", updatedResident.firstName);
        if(updatedResident.firstName == "" || updatedResident.lastName == ""){
            setErrorsExist(true)
            return true
        }
        setErrorsExist(false);
        return false
    }

    const saveResident = () => {
        console.log("first name", updatedResident.firstName);
        console.log("updated resident", updatedResident);
        //updatedResident.firstName == resident.firstName || !updatedResident.firstName
        if(updatedResident.firstName == "" || updatedResident.lastName == ""){
            setErrorsExist(true)
            return
        } 
        const residentGateway = new ResidentGateway();
        residentGateway.setResident(residentId, updatedResident);
        console.log("resident", updatedResident);
    };

    useEffect(() => {
    }, [resident]);

    const getResident = async () => {
        try {
            const gateway = new ResidentGateway();
            const resident = await gateway.getResident(residentId);
            // const caseNotesGateway = new CaseNotesGateway();
            // const caseNotes = await caseNotesGateway.getCaseNotes(residentId);

            setResident(resident);
        } catch (err) {
            console.log(`Error getting resident props with help request ID ${residentId}: ${err}`);
        }
    };

    useEffect(getResident, []);

    return (
        <Layout>
            {errorsExist &&
            <div className="govuk-error-summary" aria-labelledby="error-summary-title" role="alert"
                 tabIndex="-1" data-module="govuk-error-summary" data-testid="edit-resident-form-validation-error">
                <h2 className="govuk-error-summary__title" id="error-summary-title">
                    There is a problem
                </h2>
                <div className="govuk-error-summary__body">
                    <ul className="govuk-list govuk-error-summary__list">
                        <li>
                            <a href="#">Some required fields are empty</a>
                        </li>
                    </ul>
                </div>
            </div>}
            <div className="govuk-grid-column-one-quarter-from-desktop">
                <KeyInformation resident={resident} />
            </div>
            <div className="govuk-grid-column-three-quarters-from-desktop">
                {residentId && <EditResidentBioForm resident={resident} onChange={handleEditResident} />}

                <hr className="govuk-section-break govuk-section-break--m govuk-section-break--visible" />
                <Address initialResident={resident} onChange={handleEditAddress} />

                <hr className="govuk-section-break govuk-section-break--m govuk-section-break" />
                <h2 className="govuk-heading-l">Case notes:</h2>
                <h3 className="govuk-heading-m">Add a new case note (optional):</h3>
                <div className="govuk-form-group">
                    <span id="NewCaseNote-hint" className="govuk-hint  lbh-hint"></span>
                    <textarea
                        className="govuk-textarea  lbh-textarea"
                        id="NewCaseNote"
                        name="NewCaseNote"
                        rows="5"
                        aria-describedby="NewCaseNote-hint"></textarea>
                </div>
                <h3 className="govuk-heading-m">Case note history:</h3>
                <input type="hidden" name="CaseNotes" value="" />
                <br />
                <p className="lbh-body-m"></p>
                <h3 className="govuk-heading-m">Call attempts history:</h3>
                <br />
                <hr className="govuk-section-break govuk-section-break--m govuk-section-break--visible" />
                <CaseNotes />
                <hr className="govuk-section-break govuk-section-break--m govuk-section-break" />
                <Button
                    text="Update"
                    addClass="govuk-!-margin-right-1"
                    onClick={() => saveResident()}
                    data-testid="edit-resident-form-update-button"
                />
                <Link
                    href="/helpcase-profile/[residentId]"
                    as={`/helpcase-profile/${residentId}`}
                >
                    <Button
                        text="Cancel"
                        addClass="govuk-button--secondary"
                    />
                </Link>
            </div>
        </Layout>
    );
}

EditResident.getInitialProps = async ({ query: { residentId } }) => {
    return { residentId };
};
