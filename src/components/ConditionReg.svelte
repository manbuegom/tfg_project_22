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
            const r = await fhir.get(`/Condition/${id}`);
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
        if (id) {
            await fhir.put(`/Condition/${id}`, { ...e.detail, id });
            navigate("updated", { replace: true });
        } else {
            
            e.detail.subject = {
                display: `${nameString}`,
                reference: `${queryStringPatientId}`,
            };
            await fhir.post("/Condition", e.detail);
            navigate(`conditionForm/added?${queryStringPatientId}`, {
                replace: true,
            });
        }
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
    Condition Registration
</h1>

<div>
    <mb-fhir-form
        id="form"
        bind:this={form}
        class="flex flex-col gap-4 py-12 text-gray-700 text-lg font-semibold focus-within:text-lime-700"
        on:mb-submit={handleSubmit}
    >
        <mb-context path="resourceType" data="Condition" />
        <mb-input
            required
            id="display"
            path="code.coding[0].display"
            label="Condition Name"
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

            <Link to={`relevantDetails/${queryStringPatientId.split("/")[1]}`}>
                <button class="rounded-xl px-4 py-2 bg-lime-700 text-white"
                    >Back</button
                >
            </Link>
        </div>
    </mb-fhir-form>
</div>
