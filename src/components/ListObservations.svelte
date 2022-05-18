<script lang="ts">
    import { onMount } from "svelte";
    import { fhir } from "./fhir";
    import { Link } from "svelte-routing";

    let data = [];
    let dataP = [];
    let dataPerf = [];

    let tam, tamP;
    let patientRef;
    let deceased = false;
    let nothingSelected, nothingSelectedP;

    let searchFilter = "";

    export let id;

    onMount(async () => {
        const r = await fhir.get(`/Observation?subject=Patient/${id}`);
        data = await r.data?.entry;
        tam = r.data.total;

        const a = await fhir.get(`/Patient/${id}`);
        const dataP = a.data;
        if (dataP.deceasedDateTime != undefined) {
            deceased = true;
        }

        const rP = await fhir.get(`/Practitioner?_sort=family`);
        dataPerf = await rP.data?.entry;
        tamP = rP.data.total;

        if (tam != 0) {
            patientRef = data[0].resource.subject.reference;
        } else {
            let queryString = window.location.href
                .split("observationList")[1]
                .split("/")[1];
            patientRef = `Patient/${queryString}`;
        }
    });

    function statusFormat(e: any) {
        let statusFL = e.charAt(0).toUpperCase();
        return "" + statusFL + e.slice(1) + "";
    }

    async function searchPatient(e: any) {
        if (e.path[3].__data != undefined) {
            searchFilter = e.path[3].__data.code;
            const r = await fhir.get(
                `/Observation?subject=Patient/${id}&${searchFilter}`
            );
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
        const r = await fhir.get(`/Observation?subject=Patient/${id}&`);
        data = await r.data?.entry;
        tam = r.data.total;
    }

    async function searchPerformer(e: any) {
        if (e.path[3].__data != undefined) {
            searchFilter = e.path[3].__data.code;
            const r = await fhir.get(
                `/Observation?subject=Patient/${id}&${searchFilter}`
            );
            data = await r.data?.entry;
            tam = r.data.total;
            nothingSelectedP = false;
        } else {
            nothingSelectedP = true;
        }
    }

    async function searchClearPerf(e: any) {
        nothingSelectedP = false;
        searchFilter = "";
        const r = await fhir.get(`/Observation?subject=Patient/${id}&`);
        data = await r.data?.entry;
        tamP = r.data.total;
    }
</script>

<h1 class="text-center text-4xl text-gray-700 font-semibold mb-16">
    Patient's Observations
</h1>
<div class="grid grid-cols-2 gap-x-96">
    <div>
        <p class="text-lg text-gray-700 font-semibold py-2">
            Search observation by 'Family name, First Name'
        </p>
        <br />
        <mb-select id="searchO" placeholder="Alphabetically sorted">
            <mb-option value={`status=preliminary`} label="Preliminary" />
            <mb-option value={`status=final`} label="Final" />
            <mb-option value={`status=amended`} label="Amended" />

            <br />
            <button
                class="rounded-xl px-4 py-2 bg-lime-700 text-white"
                on:click={searchPatient}>Search</button
            >

            <button
                class="rounded-xl px-4 py-2 bg-lime-700 text-white"
                on:click={searchClear}>Clear</button
            >
        </mb-select>
        {#if nothingSelected}
            <br /><br />
            <p class="text-lg text-gray-700 font-semibold py-2">
                Select something first!
            </p>
        {/if}
    </div>
    <div>
        <p class="text-lg text-gray-700 font-semibold py-2">
            Search by practitioner
        </p>
        <br />
        <mb-select id="searchPract" placeholder="Alphabetically sorted">
            {#if tamP != 0}
                {#each dataPerf as prf}
                    <mb-option
                        value={`performer=Practitioner/${prf.resource.id}`}
                        label={`${prf.resource.name[0].family}, ${prf.resource.name[0].given}`}
                    />
                {/each}
                <br />
                <button
                    class="rounded-xl px-4 py-2 bg-lime-700 text-white"
                    on:click={searchPerformer}>Search</button
                >

                <button
                    class="rounded-xl px-4 py-2 bg-lime-700 text-white"
                    on:click={searchClearPerf}>Clear</button
                >
            {:else}
                <br />
                <p>No registered practitioners.</p>
            {/if}
        </mb-select>
        {#if nothingSelectedP}
            <br /><br />
            <p class="text-lg text-gray-700 font-semibold py-2">
                Select something first!
            </p>
        {/if}
    </div>
</div>
<br /><br />
<div class="text-center text-xl flex flex-col gap-4">
    {#if tam != 0}
        {#each data as observation}
            <div
                class="grid grid-cols-3 bg-lime-200 shadow-lg text-xl text-left py-6"
            >
                <div>
                    <br />
                    <Link
                        to={`observationForm/${observation.resource.id}`}
                        class="text-lime-700 font-bold p-4"
                        ><i class="fa-solid fa-id-card" /> Observation Details
                    </Link>
                </div>
                <br />
                {observation.resource.code.coding[0].display}
                <br />
                <div>
                    Status: {statusFormat(observation.resource.status)}
                    <br />
                    <br />
                    Created: {observation.resource.issued
                        .replace("T", " at ")
                        .replace("+01:00", "")}
                </div>
            </div>
        {/each}
    {:else}
        <p>No registered observations for the current patient.</p>
    {/if}
    <br />
</div>
<div>
    {#if !deceased}
        <Link to={`observationForm?${patientRef}`}>
            <button
                id="submit"
                class="rounded-xl px-4 py-2 bg-lime-700 text-white"
                >New Observation</button
            >
        </Link>
    {/if}
    <Link to={`patientForm/${id}`}>
        <button class="rounded-xl px-4 py-2 bg-lime-700 text-white"
            >Patient's details</button
        >
    </Link>
    <Link to="patients">
        <button class="rounded-xl px-4 py-2 bg-lime-700 text-white"
            >Patient's list</button
        >
    </Link>
</div>
