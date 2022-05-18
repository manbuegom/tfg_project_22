<script lang="ts">
    import { onMount } from "svelte";
    import { fhir } from "./fhir";
    import { Link } from "svelte-routing";

    let tam, tamF, tamR;
    let nothingSelected, nothingSelectedR;
    let dataF = [];
    let data = [];
    let dataR = [];
    let searchFilter = "";

    onMount(async () => {
        const rF = await fhir.get(`/Practitioner?_sort=family`);
        dataF = await rF.data?.entry;
        tamF = rF.data.total;

        const rFsearch = await fhir.get(`/Practitioner?_sort=family`);
        data = await rFsearch.data?.entry;
        tam = rFsearch.data.total;

        const searchR = await fhir.get(`/PractitionerRole?`);
        dataR = await searchR.data?.entry;
        tamR = searchR.data.total;
    });

    function genderFormat(e: any) {
        let genderFL = e.charAt(0).toUpperCase();
        return "" + genderFL + e.slice(1) + "";
    }

    async function searchPract(e: any) {
        if (e.path[3].__data != undefined) {
            searchFilter = e.path[3].__data.code;
            const r = await fhir.get(`/Practitioner?${searchFilter}`);
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
        const r = await fhir.get(`/Practitioner?${searchFilter}`);
        data = await r.data?.entry;
        tam = r.data.total;
    }

    async function searchPractRole(e: any) {
        if (e.path[3].__data != undefined) {
            searchFilter = e.path[3].__data.code;
            if (searchFilter == "identifier=Enfermero/a en prácticas") {
                searchFilter.replaceAll(" ", "+");
            }
            const r = await fhir.get(`/Practitioner?${searchFilter}`);
            data = await r.data?.entry;
            tam = r.data.total;
            nothingSelectedR = false;
        } else {
            nothingSelectedR = true;
        }
    }

    async function searchClearRole(e: any) {
        nothingSelectedR = false;
        searchFilter = "";
        const r = await fhir.get(`/Practitioner?${searchFilter}`);
        data = await r.data?.entry;
        tam = r.data.total;
    }
</script>

<h1 class="text-center text-4xl text-gray-700 font-semibold mb-16">
    Practitioners
</h1>
<div class="grid grid-cols-2 gap-x-96">
    <div>
        <p class="text-lg text-gray-700 font-semibold py-2">
            Search practitioner by 'Family name, First Name'
        </p>
        <br />
        <mb-select id="searchPract" placeholder="Alphabetically sorted">
            {#if tamF != 0}
                {#each dataF as p}
                    <mb-option
                        value={`name=${p.resource.name[0].given}&family=${p.resource.name[0].family}`}
                        label={`${p.resource.name[0].family}, ${p.resource.name[0].given}`}
                    />
                {/each}
                <br />
                <button
                    class="rounded-xl px-4 py-2 bg-lime-700 text-white"
                    on:click={searchPract}>Search</button
                >

                <button
                    class="rounded-xl px-4 py-2 bg-lime-700 text-white"
                    on:click={searchClear}>Clear</button
                >
            {:else}
                <br />
                <p>No registered practitioners.</p>
            {/if}
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
            Search practitioner by Role
        </p>
        <br />
        <mb-select id="searchPractRole" placeholder="Alphabetically sorted">
            {#if tamR != 0}
                {#each dataR as pr}
                    <mb-option
                        value={`identifier=${pr.resource.specialty[0].coding[0].display}`}
                        label={`${pr.resource.specialty[0].coding[0].display}`}
                    />
                {/each}
                <mb-option
                    value={`identifier=Undefined Role`}
                    label={`Undefined Role`}
                />
                <br />
                <button
                    class="rounded-xl px-4 py-2 bg-lime-700 text-white"
                    on:click={searchPractRole}>Search</button
                >

                <button
                    class="rounded-xl px-4 py-2 bg-lime-700 text-white"
                    on:click={searchClearRole}>Clear</button
                >
            {:else}
                <br />
                <p>No registered roles.</p>
            {/if}
        </mb-select>
        {#if nothingSelectedR}
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
        {#each data as practitioner}
            <div
                class="grid grid-cols-3 bg-lime-200 shadow-lg text-xl text-left p-6"
            >
                <div>
                    <br />
                    <Link
                        to={`practitionerForm/${practitioner.resource.id}`}
                        class="text-lime-700 p-4 font-bold"
                        ><i class="fa-solid fa-id-card" /> Practitioner Details
                    </Link>
                </div>
                {practitioner.resource.name[0].given}
                {practitioner.resource.name[0].family}<br />
                {practitioner.resource.qualification[0].identifier[0].value}
                <br />
                {genderFormat(practitioner.resource.gender)}
                <div>
                    {practitioner.resource.telecom[0].value}
                    {#if practitioner.resource.telecom[1] == undefined}
                        <br /> Email no registered for this practitioner.
                    {:else}
                        <br /> {practitioner.resource.telecom[1].value}
                    {/if}
                    <br />
                </div>
            </div>
        {/each}
    {:else}
        <br />
        <p>
            No registered practitioners or no matches with the selected filters.
        </p>
    {/if}
    <br />
</div>
