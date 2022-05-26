<script lang="ts">
  import { Router, Link, Route } from "svelte-routing";
  import Home from "./components/Home.svelte";
  import PatientRegistration from "./components/PatientRegistration.svelte";
  import Layout from "./Layout.svelte";
  import ListPatients from "./components/ListPatients.svelte";
  import ListObservations from "./components/ListObservations.svelte";
  import RelevantDetails from "./components/RelevantDetails.svelte";
  import ConditionReg from "./components/ConditionReg.svelte";
  import AddSuccessCond from "./components/addSuccessCond.svelte";
  import DeleteSuccessCond from "./components/deleteSuccessCond.svelte";
  import ImmunizationReg from "./components/ImmunizationReg.svelte";
  import AddSuccessImm from "./components/addSuccessImm.svelte";
  import DeleteSuccessImm from "./components/deleteSuccessImm.svelte";
  import AddSuccess from "./components/addSuccess.svelte";
  import EditSuccess from "./components/editSuccess.svelte";
  import DeleteSuccess from "./components/deleteSuccess.svelte";
  import ObservationRegistration from "./components/ObservationRegistration.svelte";
  import TailwindCss from "./components/TailwindCSS.svelte";
  import AddSuccessO from "./components/addSuccessO.svelte";
  import EditSuccessO from "./components/editSuccessO.svelte";
  import DeleteSuccessO from "./components/deleteSuccessO.svelte";
  import PractitionerRegistration from "./components/PractitionerRegistration.svelte";
  import ListPractitioners from "./components/ListPractitioners.svelte";
  import AddSuccessPractitioner from "./components/addSuccessPractitioner.svelte";
  import EditSuccessPractitioner from "./components/editSuccessPractitioner.svelte";
  import DeleteSuccessPractitioner from "./components/deleteSuccessPractitioner.svelte";
  import PractRoleRegistration from "./components/PractRoleRegistration.svelte";
  import AddSuccessPractRole from "./components/addSuccessPractRole.svelte";
  import EditSuccessPractRole from "./components/editSuccessPractRole.svelte";
  import DeleteSuccessPractRole from "./components/deleteSuccessPractRole.svelte";
</script>

<TailwindCss />

<Router>
  <nav class="bg-lime-200 shadow-lg">
    <div class="max-w-6xl mx-auto">
      <div class="flex space-x-5">
        <a
          href="/home"
          class="flex text-gray-700 text-lg font-semibold hover:text-green-800 transition duration-300 items-center py-4 px-2"
        >
          <img
            src="\src\assets\svelte.png"
            alt="Logo"
            class="h-12 w-12 mr-2"
          />HC-M</a
        >
        <div class="hidden md:flex items-center space-x-2">
          <Link
            class="py-4 px-8 text-gray-700 text-lg font-semibold hover:text-green-800 transition duration-300"
            to="patients"><i class="fa-solid fa-bars" /> Patients</Link
          >
          <Link
            class="py-4 px-8 text-gray-700 text-lg font-semibold hover:text-green-800 transition duration-300"
            to="patientForm"
            ><i class="fa-solid fa-user-plus" /> New Patient
          </Link>
          <Link
            class="py-4 px-8 text-gray-700 text-lg font-semibold hover:text-green-800 transition duration-300"
            to="practitioners"
            ><i class="fa-solid fa-bars" /> Practitioners</Link
          >
          <Link
            class="py-4 px-8 text-gray-700 text-lg font-semibold hover:text-green-800 transition duration-300"
            to="practitionerForm"
            ><i class="fa-solid fa-user-doctor" /> New Practitioner
          </Link>
          <Link
            class="py-4 px-8 text-gray-700 text-lg font-semibold hover:text-green-800 transition duration-300"
            to="practRoleForm"
            ><i class="fa-solid fa-notes-medical" /> New Pract. Role
          </Link>
        </div>
      </div>
    </div>
  </nav>
  <Layout>
    <Route path="" component={Home} />
    <Route path="/patients" component={ListPatients} />
    <Route path="patientForm" component={PatientRegistration} />
    <Route path="patientForm/:id" component={PatientRegistration} />
    <Route path="patientForm/added" component={AddSuccess} />
    <Route path="patientForm/updated" component={EditSuccess} />
    <Route path="patientForm/deleted" component={DeleteSuccess} />
    <Route path="observationForm" component={ObservationRegistration} />
    <Route path="observationForm/:id" component={ObservationRegistration} />
    <Route path="observationList/:id" component={ListObservations} />
    <Route path="relevantDetails/:id" component={RelevantDetails} />
    <Route path="conditionForm" component={ConditionReg} />
    <Route path="conditionForm:/:id" component={ConditionReg} />
    <Route path="conditionForm/added" component={AddSuccessCond} />
    <Route path="relevantDetails/delete" component={DeleteSuccessCond} />
    <Route path="immunizationForm" component={ImmunizationReg} />
    <Route path="immunizationForm:/:id" component={ImmunizationReg} />
    <Route path="immunizationForm/added" component={AddSuccessImm} />
    <Route path="relevantDetails/deletedIm" component={DeleteSuccessImm} />
    <Route path="observationForm/added" component={AddSuccessO} />
    <Route path="observationForm/updated" component={EditSuccessO} />
    <Route path="observationForm/deleted" component={DeleteSuccessO} />
    <Route path="/practitioners" component={ListPractitioners} />
    <Route path="practitionerForm" component={PractitionerRegistration} />
    <Route path="practitionerForm/:id" component={PractitionerRegistration} />
    <Route path="practitionerForm/added" component={AddSuccessPractitioner} />
    <Route
      path="practitionerForm/updated"
      component={EditSuccessPractitioner}
    />
    <Route
      path="practitionerForm/deleted"
      component={DeleteSuccessPractitioner}
    />
    <Route path="practRoleForm" component={PractRoleRegistration} />
    <Route path="practRoleForm/:id" component={PractRoleRegistration} />
    <Route path="practRoleForm/added" component={AddSuccessPractRole} />
    <Route path="practRoleForm/updated" component={EditSuccessPractRole} />
    <Route path="practRoleForm/deleted" component={DeleteSuccessPractRole} />
  </Layout>
</Router>

<footer
  id="footer"
  class="bg-lime-200 shadow md:flex md:items-center md:justify-between md:p-4"
>
  <span class="text-sm text-gray-700 sm:text-center dark:text-gray-700"
    >© 2022 FhirApp. All Rights Reserved.
  </span>
  <ul
    class="flex flex-wrap items-center mt-3 text-sm py-4 px-8 text-gray-700 font-semibold dark:text-gray-400 sm:mt-0"
  >
    <li>
      <a href="/" class="mr-4 hover:underline md:mr-6 ">About</a>
    </li>
    <li>
      <a href="/" class="mr-4 hover:underline md:mr-6">Privacy Policy</a>
    </li>
    <li>
      <a href="/" class="mr-4 hover:underline md:mr-6">Licensing</a>
    </li>
    <li>
      <a href="/" class="hover:underline">Contact</a>
    </li>
  </ul>
</footer>
