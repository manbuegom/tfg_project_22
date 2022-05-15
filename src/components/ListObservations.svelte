<script lang="ts">
    import { onMount } from "svelte";
    import { fhir } from "./fhir";
    import { Link } from "svelte-routing";

    let data = [];
    let dataA = [];
    let tam;
    let patientRef;
    let deceased = false;

    export let id;

    onMount(async () => {
        const r = await fhir.get(`/Observation?subject=Patient/${id}`);
        data = await r.data?.entry;
        tam = r.data.total;

        const a = await fhir.get(`/Patient/${id}`);
        const dataA = a.data;
        if (dataA.deceasedDateTime != undefined) {
            deceased = true;
        }

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
</script>

<h1 class="text-center text-4xl text-gray-700 font-semibold mb-16">
    Patient's Observations
</h1>
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
                    <br>
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
    <Link to=patients>
        <button class="rounded-xl px-4 py-2 bg-lime-700 text-white"
            >Patient's list</button
        >
    </Link>
</div>
