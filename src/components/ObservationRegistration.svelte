<script lang="ts">
    import { onMount } from "svelte";
    import "medblocks-ui";
    import "medblocks-ui/dist/shoelace";
    import { fhir } from "./fhir";
    import { navigate, Link } from "svelte-routing";

    let loading: boolean = false;
    export let id;
    let form;

    async function handleSubmit(e: any) {
        loading = true;
        if (id) {
            e.detail.issued = createdNoFormat;
            await fhir.put(`/Observation/${id}`, { ...e.detail, id });
            debugger;
            navigate(`updated?${referenceIdPatient}`, { replace: true });
        } else {
            const queryString = window.location.search.split("?")[1];
            e.detail.subject.reference = queryString;
            e.detail.issued = calculateInstant();
            await fhir.post("/Observation", e.detail);
            navigate(`observationForm/added?${queryString.split("/")[1]}`, {
                replace: true,
            });
        }
        loading = false;
    }

    function calculateInstant() {
        let today = new Date();
        let month = "" + (today.getMonth() + 1) + "";
        let day = "" + today.getDate() + "";
        let hour = "" + today.getHours() + "";
        let minutes = "" + today.getMinutes() + "";
        let seconds = "" + today.getSeconds() + "";

        if (month.length == 1) {
            month = "0" + month + "";
        }
        if (day.length == 1) {
            day = "0" + day + "";
        }
        if (hour.length == 1) {
            hour = "0" + hour + "";
        }
        if (minutes.length == 1) {
            minutes = "0" + minutes + "";
        }
        if (seconds.length == 1) {
            seconds = "0" + seconds + "";
        }
        return (
            today.getFullYear() +
            "-" +
            month +
            "-" +
            day +
            "T" +
            hour +
            ":" +
            minutes +
            ":" +
            seconds +
            "+01:00"
        );
    }

    async function handleDelete(e: any) {
        loading = true;
        if (id) {
            await fhir.delete(`/Observation/${id}`, { ...e.detail, id });
            navigate(`deleted?${referenceIdPatient}`, { replace: true });
        }
        loading = false;
    }
    let referenceIdPatient;
    let createdNoFormat;
    let created;
    let modified;
    let issuedOn;
    let deleteOn;
    let lastModOn;
    let deceased;
    onMount(async () => {
        if (id) {
            const r = await fhir.get(`/Observation/${id}`);
            const resource = r.data;
            form.import(resource);
            issuedOn = true;
            lastModOn = true;
            deleteOn = true;
            referenceIdPatient = resource.subject.reference.split("/")[1];
            modified = resource.meta.lastUpdated
                .split(".")[0]
                .replace("T", " at ");
            createdNoFormat = resource.issued;
            created = resource.issued
                .replace("T", " at ")
                .replace("+01:00", ".");
            const a = await fhir.get(`/Patient/${referenceIdPatient}`);
            const dataA = a.data;
            if (dataA.deceasedDateTime != undefined) {
                disableFormIfDiceased(true);
            }
        }
    });
    async function disableFormIfDiceased(e: any) {
        (<HTMLInputElement>document.getElementById("status")).disabled = e;
        (<HTMLInputElement>document.getElementById("name")).disabled = e;
        (<HTMLInputElement>document.getElementById("descrip")).disabled = e;
        (<HTMLInputElement>document.getElementById("code")).disabled = e;
        (<HTMLInputElement>document.getElementById("vq")).disabled = e;
        (<HTMLInputElement>document.getElementById("units")).disabled = e;
        (<HTMLInputElement>document.getElementById("submit")).disabled = e;
    }

    let queryStringPatientId = window.location.search.split("/")[1];
</script>

<h1 class="text-center text-4xl text-gray-700 font-semibold py-4">
    Observation Registration
</h1>
<div>
    <mb-fhir-form
        id="form"
        bind:this={form}
        class="flex flex-col gap-4 text-gray-700 text-lg font-semibold focus-within:text-lime-700"
        on:mb-submit={handleSubmit}
    >
        <mb-context path="resourceType" data="Observation" />
        <mb-input required id="status" path="status" label="Status" />
        <mb-input required id="name" path="subject.display" label="Name" />
        <mb-input required id="descrip" path="code.coding[0].system" label="Description" />
        <mb-input required id="code" path="code.coding[0].code" label="Code" />
        <mb-count required id="vq" path="valueQuantity.value" label="Value Quantity" />
        <mb-input required id="units" path="valueQuantity.unit" label="Units" />
        <mb-input hidden path="subject.reference" label="Subject" />
        {#if issuedOn}
            <p class="text-base py-2">
                Created:
                <br />{created}
            </p>
        {/if}
        {#if lastModOn}
            <p class="text-base py-2">
                Last modified (GMT):
                <br />{modified}
            </p>
        {/if}

        <div />
        <div>
            <br />
            <mb-submit>
                <button class="rounded-xl px-4 py-2 bg-lime-700 text-white"
                    >Submit</button
                >
            </mb-submit>
            {#if !deleteOn}
                <Link to={`observationList/${queryStringPatientId}`}>
                    <button class="rounded-xl px-4 py-2 bg-lime-700 text-white"
                        >Back to list</button
                    >
                </Link>
            {/if}
            {#if deleteOn}
                <Link to={`observationList/${referenceIdPatient}`}>
                    <button class="rounded-xl px-4 py-2 bg-lime-700 text-white"
                        >Back to list</button
                    >
                </Link>
                <button
                    class="rounded-xl px-4 py-2 bg-orange-700 text-white"
                    on:click={handleDelete}
                    >Delete Observation
                </button>
            {/if}
        </div>
    </mb-fhir-form>
</div>
