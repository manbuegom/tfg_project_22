<script lang="ts">
    import { onMount } from "svelte";
    import "medblocks-ui";
    import "medblocks-ui/dist/shoelace";
    import { fhir } from "./fhir";
    import { navigate, Link } from "svelte-routing";

    let loading: boolean = false;
    export let id;
    let form;
    let queryStringPractitionerId = window.location.search.split("/")[1];
    async function handleSubmit(e: any) {
        loading = true;
        if (id) {
            e.detail.practitioner = {
                display: `${nameString}`,
                reference: `${referencePract}`,
            };
            await fhir.put(`/PractitionerRole/${id}`, { ...e.detail, id });
            navigate("updated", { replace: true });
        } else {
            const queryString = window.location.search.split("?")[1];
            e.detail.practitioner = {
                display: `${nameString}`,
                reference: `${queryString}`,
            };
            await fhir.post("/PractitionerRole", e.detail);
            navigate("practRoleForm/added", { replace: true });
        }
        loading = false;
    }
    async function handleDelete(e: any) {
        loading = true;
        if (id) {
            await fhir.delete(`/PractitionerRole/${id}`, { ...e.detail, id });
            navigate("deleted", { replace: true });
        }
        loading = false;
    }

    let referenceIdPract;
    let referencePract;
    let nameString;
    let deleteOn;
    onMount(async () => {
        if (id) {
            const r = await fhir.get(`/PractitionerRole/${id}`);
            const resource = r.data;
            form.import(resource);
            referenceIdPract = resource.practitioner.reference.split("/")[1];
            referencePract = resource.practitioner.reference;
            nameString = await getName(referenceIdPract);
            deleteOn = true;
        }else{
        nameString = await getName(queryStringPractitionerId);
    }
    });
    async function getName(e: any) {
        const a = await fhir.get(`/Practitioner/${e}`);
        const dataA = a.data;
        let string =
            "" + dataA.name[0].given + "" + " " + dataA.name[0].family + "";
        return string;
    }
</script>

<h1 class="text-center text-4xl text-gray-700 font-semibold py-4">
    Practitioner Role Registration
</h1>
<div>
    <mb-fhir-form
        id="form"
        bind:this={form}
        class="flex flex-col gap-4 py-12 text-gray-700 text-lg font-semibold focus-within:text-lime-700"
        on:mb-submit={handleSubmit}
    >
        <mb-context path="resourceType" data="PractitionerRole" />

        <mb-input
            required
            id="specialty"
            path="specialty[0].coding[0].system"
            label="System"
        />
        <mb-input
            required
            id="code"
            path="specialty[0].coding[0].code"
            label="Code"
        />
        <mb-input
            required
            id="display"
            path="specialty[0].coding[0].display"
            label="Display"
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
            {#if !deleteOn}
                <Link to={`practitionerForm/${queryStringPractitionerId}`}>
                    <button class="rounded-xl px-4 py-2 bg-lime-700 text-white"
                        >Back to practitioner</button
                    >
                </Link>
            {/if}
            {#if deleteOn}
                <Link to={`practitionerForm/${referenceIdPract}`}>
                    <button class="rounded-xl px-4 py-2 bg-lime-700 text-white"
                        >Back to practitioner</button
                    >
                </Link>
                <button
                    class="rounded-xl px-4 py-2 bg-orange-900 text-white"
                    on:click={handleDelete}
                    >Delete Practitioner Role
                </button>
            {/if}
        </div>
    </mb-fhir-form>
</div>
