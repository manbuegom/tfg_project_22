<script lang="ts">
    import { onMount } from "svelte";
    import "medblocks-ui";
    import "medblocks-ui/dist/shoelace";
    import { fhir } from "./fhir";
    import { navigate, Link } from "svelte-routing";

    let deleteOn, nameString, referenceIdPatient;
    let loading: boolean = false;
    export let id;
    let form;
    let queryStringPatientId = window.location.search.split("?")[1];

    onMount(async () => {
        if (id) {
            const r = await fhir.get(`/Immunization/${id}`);
            const resource = r.data;
            form.import(resource);
            deleteOn = true;
            referenceIdPatient = resource.subject.reference.split("/")[1];
            nameString = await getName(`${referenceIdPatient}`);
        }
        nameString = await getName(`${queryStringPatientId}`);
    });

    async function handleSubmit(e: any) {
        loading = true;

        const queryString = window.location.search.split("?")[1];
        e.detail.patient = {
            reference: `${queryString}`,
        };
        await fhir.post("/Immunization", e.detail);
        navigate(`immunizationForm/added?${queryString.split("/")[1]}`, {
            replace: true,
        });

        loading = false;
    }

    async function getName(e: any) {
        const a = await fhir.get(e);
        const dataA = a.data;
        let string =
            "" + dataA.name[0].given + "" + " " + dataA.name[0].family + "";
        return string;
    }
</script>

<h1 class="text-center text-4xl text-gray-700 font-semibold mb-16">
    Immunization Registration
</h1>

<div>
    <mb-fhir-form
        id="form"
        bind:this={form}
        class="flex flex-col gap-4 py-12 text-gray-700 text-lg font-semibold focus-within:text-lime-700"
        on:mb-submit={handleSubmit}
    >
        <mb-context path="resourceType" data="Immunization" />
        <mb-input
            required
            id="display"
            path="vaccineCode.coding[0].display"
            label="Immunization Name"
        />

        <mb-input
            id="display"
            path="vaccineCode.text"
            label="Comments"
        />

        <div>
            <br />
            <mb-submit>
                <button
                    id="submit"
                    class="rounded-xl px-4 py-2 bg-lime-700 text-white"
                    >Submit</button
                >
            </mb-submit>

            <Link to="relevantDetails">
                <button class="rounded-xl px-4 py-2 bg-lime-700 text-white"
                    >Back</button
                >
            </Link>
        </div>
    </mb-fhir-form>
</div>
