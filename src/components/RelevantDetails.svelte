<script lang="ts">
    import { onMount } from "svelte";
    import { fhir } from "./fhir";
    import { navigate, Link } from "svelte-routing";

    let data = [];
    let dataI = [];

    let tam, tamI;
    let patientRef, nameString, loading;
    let deceased = false;
    let queryStringPatientId = window.location.href.split("/")[4];

    export let id;

    onMount(async () => {
        const c = await fhir.get(`/Condition?subject=Patient/${id}`);
        data = await c.data?.entry;
        tam = c.data.total;

        const i = await fhir.get(`/Immunization?patient=Patient/${id}`);
        dataI = await i.data?.entry;
        tamI = i.data.total;

        const p = await fhir.get(`/Patient/${id}`);
        const dataP = p.data;
        nameString =
            "" + dataP.name[0].given + "" + " " + dataP.name[0].family + "";

        if (dataP.deceasedDateTime != undefined) {
            deceased = true;
        }

        if (tam != 0) {
            patientRef = data[0].resource.subject.reference;
        } else {
            let queryString = window.location.href
                .split("relevantDetails")[1]
                .split("/")[1];
            patientRef = `Patient/${queryString}`;
        }
    });

    async function handleDelete(e: any) {
        loading = true;

        if (e.currentTarget.id.split("/")[1] == "con") {
            let idC = e.currentTarget.id.split("/")[0];
            await fhir.delete(
                `/Condition/${e.currentTarget.id.split("/")[0]}`,
                { ...e.detail, idC }
            );
            navigate(`delete?${patientRef.split("/")[1]}`, {
                replace: true,
            });
            loading = false;
        } else {
            let idI = e.currentTarget.id.split("/")[0];
            await fhir.delete(
                `/Immunization/${e.currentTarget.id.split("/")[0]}`,
                { ...e.detail, idI }
            );
            navigate(`deletedIm?${patientRef.split("/")[1]}`, {
                replace: true,
            });
            loading = false;
        }
    }
</script>

<h1 class="text-center text-4xl text-gray-700 font-semibold mb-16">
    Patient's Relevant Details
</h1>

<div class="text-gray-700 text-lg font-semibold">
    <p>
        Patient name:
        <Link
            to={`patientForm/${queryStringPatientId}`}
            class="text-lime-700 p-4 font-bold"
            >{nameString}
        </Link>
    </p>
    <br /><br /><br />
</div>

<div class="grid grid-cols-2 gap-4">
    <div>
        <h3 class="text-center text-2xl  text-gray-700 font-semibold mb-16">
            Conditions
        </h3>
        <div class="text-center text-xl flex flex-col gap-4">
            {#if tam != 0}
                {#each data as condition}
                    <div
                        class=" bg-lime-200 shadow-lg text-xl text-left p-6 mr-4"
                    >
                        <button
                            on:click={handleDelete}
                            class="text-lime-700 p-4 font-bold"
                            id={condition.resource.id + "/con"}
                            ><i class="fa-solid fa-trash-can" />
                        </button>
                        - {condition.resource.code.coding[0].display}
                    </div>
                {/each}
            {:else}
                <p>No conditions registered for this patient.</p>
            {/if}
            <br />
        </div>
        <div>
            {#if !deceased}
                <Link to={`conditionForm?${patientRef}`}>
                    <button
                        id="submit"
                        class="rounded-xl px-4 py-2 mr-8 bg-lime-700 text-white"
                        >New Condition</button
                    >
                </Link>
            {/if}
        </div>
    </div>
    <div class="border-l-4 border-gray-700">
        <h3 class="text-center text-2xl  text-gray-700 font-semibold mb-16">
            Immunizations
        </h3>
        <div class="text-center text-xl flex flex-col gap-4 ml-4">
            {#if tamI != 0}
                {#each dataI as im}
                    <div
                        class=" bg-lime-200 shadow-lg text-xl text-left p-6 ml-4"
                    >
                        <button
                            on:click={handleDelete}
                            class="text-lime-700 p-4 font-bold"
                            id={im.resource.id + "/im"}
                            ><i class="fa-solid fa-trash-can" />
                        </button>
                        - {im.resource.vaccineCode.coding[0].display}
                    </div>
                {/each}
            {:else}
                <p>No immunizations registered for this patient.</p>
            {/if}
            <br />
        </div>
        <div>
            {#if !deceased}
                <Link to={`immunizationForm?${patientRef}`}>
                    <button
                        id="submit"
                        class="rounded-xl px-4 py-2 ml-8 bg-lime-700 text-white"
                        >New Immunization</button
                    >
                </Link>
            {/if}
        </div>
    </div>
</div>
