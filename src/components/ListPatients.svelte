<script lang="ts">
    import { onMount } from "svelte";
    import { fhir } from "./fhir";
    import { Link } from "svelte-routing";

    let data = [];
    let dataF = [];
    let tam;
    let nothingSelected;

    let searchFilter = "";

    // timedRefresh(1000);

    // function timedRefresh(timeoutPeriod) {
    //     setInterval("location.reload(true);", timeoutPeriod);
    // }

    onMount(async () => {
        const rF = await fhir.get(`/Patient?_sort=family`);
        dataF = await rF.data?.entry;
        tam = rF.data.total;

        const rFsearch = await fhir.get(`/Patient?_sort=family`);
        data = await rF.data?.entry;
        tam = rF.data.total;
    });

    async function searchPatient(e: any) {
        if (e.path[3].__data != undefined) {
            searchFilter = e.path[3].__data.code;
            const r = await fhir.get(`/Patient?${searchFilter}&_sort=family`);
            data = await r.data?.entry;
            tam = r.data.total;
            nothingSelected = false;
        } else {
            nothingSelected = true;
        }
    }

    async function searchClear(e: any) {
        nothingSelected = false;
        searchFilter = "";
        const r = await fhir.get(`/Patient?_sort=family`);
        data = await r.data?.entry;
        tam = r.data.total;
    }

    function age(e: any) {
        if (e.deceasedDateTime != undefined) {
            var deathDate = new Date(e.deceasedDateTime);
            var birthday = new Date(e.birthDate);
            var age = deathDate.getFullYear() - birthday.getFullYear();
            var m = deathDate.getMonth() - birthday.getMonth();
            if (
                m < 0 ||
                (m === 0 && deathDate.getDate() < birthday.getDate())
            ) {
                age--;
            }
            return age;
        } else {
            var today = new Date();
            var birthday = new Date(e.birthDate);
            var age = today.getFullYear() - birthday.getFullYear();
            var m = today.getMonth() - birthday.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
                age--;
            }
            return age;
        }
    }

    function genderFormat(e: any) {
        let genderFL = e.charAt(0).toUpperCase();
        return "" + genderFL + e.slice(1) + "";
    }
</script>

<h1 class="text-center text-4xl text-gray-700 font-semibold mb-16">Patients</h1>
<p class="text-lg text-gray-700 font-semibold py-2">
    Search patient by 'Family name, First Name'
</p>
<br />
<mb-select id="searchPatient" placeholder="Alphabetically sorted">
    {#if tam != 0}
        {#each dataF as p}
            <mb-option
                value={`name=${p.resource.name[0].given}&family=${p.resource.name[0].family}`}
                label={`${p.resource.name[0].family}, ${p.resource.name[0].given}`}
            />
        {/each}
        <br />
        <button
            class="rounded-xl px-4 py-2 bg-lime-700 text-white"
            on:click={searchPatient}>Search</button
        >

        <button
            class="rounded-xl px-4 py-2 bg-lime-700 text-white"
            on:click={searchClear}>Clear</button
        >
    {:else}
        <br />
        <p>No registered patients.</p>
    {/if}
</mb-select>
{#if nothingSelected}
    <br /><br />
    <p class="text-lg text-gray-700 font-semibold py-2">
        Select something first!
    </p>
{/if}
<br /><br />
<div class="text-center text-xl flex flex-col gap-4">
    {#if tam != 0}
        {#each data as patient}
            <div
                class="grid grid-cols-3 bg-lime-200 shadow-lg text-xl text-left p-6"
            >
                {#if patient.resource.deceasedDateTime != undefined}
                    <div>
                        <Link
                            to={`patientForm/${patient.resource.id}`}
                            class="text-lime-700 p-4 font-bold"
                            ><i class="fa-solid fa-id-card" /> Patient Details
                        </Link> <br /><br />
                        <Link
                            to={`medicDetailsForm/${patient.resource.id}`}
                            class="text-lime-700 p-4 font-semibold"
                            ><i class="fa-solid fa-briefcase-medical" /> Relevant Details
                        </Link> <br /><br />
                        <Link
                            to={`observationList/${patient.resource.id}`}
                            class="text-lime-700 p-4 font-bold"
                            ><i class="fa-solid fa-stethoscope" /> Observations
                        </Link>
                    </div>
                    {patient.resource.name[0].given}
                    {patient.resource.name[0].family}<br /><br />
                    ({patient.resource.birthDate})
                    <br /><br />
                    {genderFormat(patient.resource.gender)}
                    <div>
                        <p>Deceased date:</p><br />
                        {patient.resource.deceasedDateTime}
                        <br /><br />
                        At age: {age(patient.resource)}
                    </div>
                {:else}
                    <div>
                        <Link
                            to={`patientForm/${patient.resource.id}`}
                            class="text-lime-700 p-4 font-semibold "
                            ><i class="fa-solid fa-id-card" /> Patient Details
                        </Link> <br /><br />
                        <Link
                            to={`medicDetailsForm/${patient.resource.id}`}
                            class="text-lime-700 p-4 font-semibold"
                            ><i class="fa-solid fa-briefcase-medical" /> Relevant Details
                        </Link> <br /><br />
                        <Link
                            to={`observationList/${patient.resource.id}`}
                            class="text-lime-700 p-4 font-semibold"
                            ><i class="fa-solid fa-stethoscope" /> Observations
                        </Link>
                    </div>
                    {patient.resource.name[0].given}
                    {patient.resource.name[0].family}<br /><br />
                    {age(patient.resource)} ({patient.resource.birthDate})
                    <br /><br />{genderFormat(patient.resource.gender)}
                    <div>
                        {patient.resource.address[0].city}
                        <br /><br />
                        {patient.resource.telecom[0].value}
                        {#if patient.resource.telecom[1] == undefined}
                            <br /><br /> Email no registered for this patient.
                        {:else}
                            <br /><br />{patient.resource.telecom[1].value}ㅤ
                        {/if}
                    </div>
                {/if}
            </div>
        {/each}
    {:else}
        <p>No registered patients.</p>
    {/if}
    <br />
</div>
