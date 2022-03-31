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
        if (tam != 0) {
            patientRef = data[0].resource.subject.reference;
            const a = await fhir.get(`/Patient/${id}`);
            const dataA = a.data;
            debugger
            if(dataA.deceasedDateTime != undefined){
                deceased = true;
                debugger
            }
        } else {
            const a = await fhir.get(`/Patient/${id}`);
            const dataA = a.data;
            debugger
            if(dataA.deceasedDateTime != undefined){
                deceased = true;
                debugger
            }
            let queryString = window.location.href
                .split("observationList")[1]
                .split("/")[1];
            patientRef = `Patient/${queryString}`;
        }
    });
</script>

<div class="container">
    <h1 class="text-center text-4xl text-gray-700 font-semibold mb-16">
        Patient's Observations
    </h1>
    <div class="text-center text-xl flex flex-col gap-4">
        {#if tam != 0}
            {#each data as observation}
                <div
                    class="grid grid-flow-col auto-cols-min grid-cols-2 bg-lime-200 shadow-lg text-lg text-left py-6 px-4"
                >
                    <Link
                        to={`observationForm/${observation.resource.id}`}
                        class="text-lime-700 p-4 font-bold"
                        ><i class="fa-solid fa-id-card" /> Observation Details
                    </Link>
                    {observation.resource.code.coding[0].system}
                    {observation.resource.code.coding[0].code}<br />
                    {observation.resource.valueQuantity.value}
                    {observation.resource.valueQuantity.unit})
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
        <Link to="patients">
            <button class="rounded-xl px-4 py-2 bg-lime-700 text-white"
                >Patient's list</button
            >
        </Link>
    </div>
</div>
