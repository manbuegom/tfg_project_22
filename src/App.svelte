<script lang="ts">
  import { Router, Link, Route } from "svelte-routing";
  import PatientRegistration from "./components/PatientRegistration.svelte";
  import Layout from "./Layout.svelte";
  import ListPatients from "./components/ListPatients.svelte";
  import ListObservations from "./components/ListObservations.svelte";
  import AddSuccess from "./components/addSuccess.svelte";
  import EditSuccess from "./components/editSuccess.svelte";
  import DeleteSuccess from "./components/deleteSuccess.svelte";
  import ObservationRegistration from "./components/ObservationRegistration.svelte";
  import TailwindCss from "./components/TailwindCSS.svelte";
  import AddSuccessO from "./components/addSuccessO.svelte";
  import EditSuccessO from "./components/editSuccessO.svelte";
  import DeleteSuccessO from "./components/deleteSuccessO.svelte";
</script>

<TailwindCss />

<Router>
  <nav class="bg-lime-200 shadow-lg">
    <div class="max-w-6xl mx-auto px-4">
      <div class="flex justify-between">
        <div class="flex space-x-7">
          <a
            href="/"
            class="flex text-gray-700 text-lg font-semibold hover:text-green-800 transition duration-300 items-center py-4 px-2"
          >
            <img
              src="\src\assets\svelte.png"
              alt="Logo"
              class="h-12 w-12 mr-2"
            />Patient Management Site</a
          >
          <div class="hidden md:flex items-center space-x-2">
            <Link
        
              class="py-4 px-8 text-gray-700 text-lg font-semibold hover:text-green-800 transition duration-300"
              to="patients"><i class="fa-solid fa-bars"></i> List</Link
            >
            <Link
              class="py-4 px-8 text-gray-700 text-lg font-semibold hover:text-green-800 transition duration-300"
              to="patientForm"><i class="fa-solid fa-user-pen"></i> Patient
              
            </Link>
            <Link
              class="py-4 px-8 text-gray-700 text-lg font-semibold hover:text-green-800 transition duration-300"
              to="blog">Blog</Link
            >
          </div>
        </div>
      </div>
    </div>
  </nav>
  <Layout>
    <Route path="/patients" component={ListPatients} />
    <Route path="patientForm" component={PatientRegistration} />
    <Route path="patientForm/:id" component={PatientRegistration} />
    <Route path="patientForm/added" component={AddSuccess} />
    <Route path="patientForm/updated" component={EditSuccess} />
    <Route path="patientForm/deleted" component={DeleteSuccess} />
    <Route path="observationForm" component={ObservationRegistration} />
    <Route path="observationForm/:id" component={ObservationRegistration} />
    <Route path="observationList/:id" component={ListObservations} />
    <Route path="observationForm/added" component={AddSuccessO} />
    <Route path="observationForm/updated" component={EditSuccessO} />
    <Route path="observationForm/deleted" component={DeleteSuccessO} />
  </Layout>
</Router>

<footer
  class="bg-lime-200 rounded-lg shadow md:flex md:items-center md:justify-between md:p-4"
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
