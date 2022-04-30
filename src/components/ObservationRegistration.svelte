<script lang="ts">
    import { onMount } from "svelte";
    import "medblocks-ui";
    import "medblocks-ui/dist/shoelace";
    import { fhir } from "./fhir";
    import { navigate, Link } from "svelte-routing";

    let loading: boolean = false;
    export let id;
    let form;
    let queryStringPatientId = window.location.search.split("/")[1];

    async function handleSubmit(e: any) {
        loading = true;
        if (id) {
            e.detail.issued = createdNoFormat;
            await fhir.put(`/Observation/${id}`, { ...e.detail, id });
            navigate(`updated?${referenceIdPatient}`, { replace: true });
        } else {
            const queryString = window.location.search.split("?")[1];
            e.detail.subject = {
                display: `${nameString}`,
                reference: `${queryString}`,
            };
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
    let nameString;

    onMount(async () => {
        if (id) {
            const r = await fhir.get(`/Observation/${id}`);
            const resource = r.data;
            form.import(resource);
            issuedOn = true;
            lastModOn = true;
            deleteOn = true;
            referenceIdPatient = resource.subject.reference.split("/")[1];
            nameString = await getName(referenceIdPatient);
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
        }else{
        nameString = await getName(queryStringPatientId);
    }});
    async function disableFormIfDiceased(e: any) {
        (<HTMLInputElement>document.getElementById("status")).disabled = e;
        (<HTMLInputElement>document.getElementById("system")).disabled = e;
        (<HTMLInputElement>document.getElementById("code")).disabled = e;
        (<HTMLInputElement>document.getElementById("display")).disabled = e;
        (<HTMLInputElement>document.getElementById("vq")).disabled = e;
        (<HTMLInputElement>document.getElementById("units")).disabled = e;
        (<HTMLInputElement>document.getElementById("note")).disabled = e;
        (<HTMLInputElement>document.getElementById("submit")).disabled = e;
    }
    async function getName(e: any) {
        const a = await fhir.get(`/Patient/${e}`);
        const dataA = a.data;
        let string =
            "" + dataA.name[0].given + "" + " " + dataA.name[0].family + "";
        return string;
    }
</script>

<h1 class="text-center text-4xl text-gray-700 font-semibold py-4">
    Observation Registration
</h1>
<div>
    <mb-fhir-form
        id="form"
        bind:this={form}
        class="flex flex-col gap-4 py-12 text-gray-700 text-lg font-semibold focus-within:text-lime-700"
        on:mb-submit={handleSubmit}
    >
        <mb-context path="resourceType" data="Observation" />
        <p>
            Patient name:
            {#if deleteOn}
                <Link
                    to={`patientForm/${referenceIdPatient}`}
                    class="text-lime-700 p-4 font-bold"
                    >{nameString}
                </Link>
            {:else}
                <Link
                    to={`patientForm/${queryStringPatientId}`}
                    class="text-lime-700 p-4 font-bold"
                    >{nameString}
                </Link>
            {/if}
        </p>
        <mb-input required id="status" path="status" label="Status" />
        <mb-input
            required
            id="system"
            path="code.coding[0].system"
            label="System"
        />
        <mb-input required id="code" path="code.coding[0].code" label="Code" />
        <mb-input required id="display" path="code.coding[0].display" label="Display" />
        <mb-count
            required
            id="vq"
            path="valueQuantity.value"
            label="Value Quantity"
        />
        <mb-input required id="units" path="valueQuantity.unit" label="Units" />
        <mb-input required id="note" path="note[0].text" label="Comments" />
        <mb-input hidden id="name" path="subject.display" label="Name" />
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
                <button
                    id="submit"
                    class="rounded-xl px-4 py-2 bg-lime-700 text-white"
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
