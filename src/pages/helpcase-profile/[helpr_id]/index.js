import React from "react";
import Layout from "../../../components/layout";
import SupportTable from "../../../components/SupportTable/SupportTable";
import KeyInformation from "../../../components/KeyInformation/KeyInformation";
import CaseNotes from "../../../components/CaseNotes/CaseNotes";
import Link from "next/link";
import { Button } from "../../../components/Form";
import { useRouter } from "next/router";

export default function HelpcaseProfile({ helpr_id, resident }) {
  const router = useRouter();

  console.log(router.query);
  //useEffect();
  return (
    <Layout>
      <div>
        <a
          href="#"
          class="govuk-back-link"
          style={{
            marginTop: "-40px",
            display: "block",
            borderBottom: "none"
          }}
        >
          Back {helpr_id}
        </a>
        <div class="govuk-grid-row">
          <div class="govuk-grid-column-one-quarter-from-desktop sticky-magic">
            <KeyInformation />
          </div>

          <div class="govuk-grid-column-three-quarters-from-desktop">
            <h1
              class="govuk-heading-xl"
              style={{ marginTop: "0px", marginBottom: "40px" }}
            >
              {resident.FirstName} {resident.LastName}
            </h1>

            <SupportTable />

            <Link href="/add-support">
              <Button text="+ Add new support" />
            </Link>

            <hr />

            <br />
            <CaseNotes />
          </div>
        </div>
      </div>
    </Layout>
  );
}

HelpcaseProfile.getInitialProps = async ({ query: { helpr_id }, req, res }) => {
  try {
    const resident = { FirstName: "Firstname", LastName: "Lastname" };
    return {
      helpr_id: helpr_id,
      resident: resident
    };
  } catch (err) {
    console.log(
      `Error getting resident props with help request ID ${helpr_id}`
    );
  }
};
