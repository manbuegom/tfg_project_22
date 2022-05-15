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
    let dataP = [];
    let tam;

    async function handleSubmit(e: any) {
        loading = true;
        if (id) {
            if (
                (<HTMLInputElement>document.getElementById("statusAux"))
                    .value == lastStatusRegistered ||
                (<HTMLInputElement>document.getElementById("statusAux"))
                    .value == undefined
            ) {
                e.detail.status = lastStatusRegistered;
            } else {
                e.detail.status = (<HTMLInputElement>(
                    document.getElementById("statusAux")
                )).value;
            }
            e.detail.issued = createdNoFormat;
            e.detail.performer = [
                {
                    reference: `${performerDetailRef}`,
                },
            ];

            e.detail.code.coding[0].code = calculateInstant();
            try {
                await fhir.put(`/Observation/${id}`, { ...e.detail, id });
                navigate(`updated?${referenceIdPatient}`, { replace: true });
            } catch (error) {
                errorOn = true;
                navigate(`/observationForm/${id}`, {
                    replace: true,
                });
            }
        } else {
            if (
                (<HTMLInputElement>document.getElementById("statusAux"))
                    .value == undefined
            ) {
                e.detail.status = "preliminary";
            } else {
                e.detail.status = (<HTMLInputElement>(
                    document.getElementById("statusAux")
                )).value;
            }
            if (e.detail.performer != undefined) {
                e.detail.performer = [
                    {
                        reference: `${e.detail.performer[0].reference.code}`,
                    },
                ];
            }
            const queryString = window.location.search.split("?")[1];
            e.detail.subject = {
                display: `${nameString}`,
                reference: `${queryString}`,
            };
            e.detail.issued = calculateInstant();
            e.detail.code.coding[0].code = calculateInstant();
            try {
                await fhir.post("/Observation", e.detail);
                navigate(`observationForm/added?${queryString.split("/")[1]}`, {
                    replace: true,
                });
            } catch (error) {
                errorOn = true;

                navigate(`/observationForm?${queryString}`, {
                    replace: true,
                });
            }
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

    let issuedOn, created, createdNoFormat, deleteOn, modified, lastModOn;

    let nameString, nameStringP;
    let lastStatusRegistered, actualStatus;
    let practitionerId, referenceIdPatient, performerDetailRef;

    onMount(async () => {
        if (id) {
            const r = await fhir.get(`/Observation/${id}`);
            const resource = r.data;
            form.import(resource);
            issuedOn = true;
            lastModOn = true;
            deleteOn = true;
            referenceIdPatient = resource.subject.reference.split("/")[1];
            nameString = await getName(`/Patient/${referenceIdPatient}`);
            practitionerId = resource.performer[0].reference.split("/")[1];
            nameStringP = await getName(`/Practitioner/${practitionerId}`);
            lastStatusRegistered = resource.status;
            let actualStatusFL = lastStatusRegistered.charAt(0).toUpperCase();
            actualStatus =
                "" + actualStatusFL + lastStatusRegistered.slice(1) + "";

            modified = resource.code.coding[0].code
                .split(".")[0]
                .replace("T", " at ")
                .replace("+01:00", ".");
            createdNoFormat = resource.issued;
            created = resource.issued
                .replace("T", " at ")
                .replace("+01:00", ".");

            performerDetailRef = resource.performer[0].reference;

            const a = await fhir.get(`/Patient/${referenceIdPatient}`);
            const dataA = a.data;
            if (dataA.deceasedDateTime != undefined) {
                disableFormIfDiceased(true);
            }
        } else {
            nameString = await getName(`/Patient/${queryStringPatientId}`);
        }
    });
    async function disableFormIfDiceased(e: any) {
        (<HTMLInputElement>document.getElementById("preliminary")).disabled = e;
        (<HTMLInputElement>document.getElementById("final")).disabled = e;
        (<HTMLInputElement>document.getElementById("amended")).disabled = e;
        (<HTMLInputElement>document.getElementById("statusAux")).disabled = e;
        (<HTMLInputElement>document.getElementById("display")).disabled = e;
        (<HTMLInputElement>document.getElementById("vq")).disabled = e;
        (<HTMLInputElement>document.getElementById("units")).disabled = e;
        (<HTMLInputElement>document.getElementById("note")).disabled = e;
        (<HTMLInputElement>document.getElementById("submit")).disabled = e;
    }
    async function getName(e: any) {
        const a = await fhir.get(e);
        const dataA = a.data;
        let string =
            "" + dataA.name[0].given + "" + " " + dataA.name[0].family + "";
        return string;
    }

    async function handleStatus(e: any) {
        (<HTMLInputElement>document.getElementById("statusAux")).value =
            e.target.id;
    }

    onMount(async () => {
        const p = await fhir.get("/Practitioner");
        dataP = await p.data?.entry;
        tam = p.data.total;
    });

    let errorOn = false;
    async function checkValid(e: any) {
        (<HTMLInputElement>document.getElementById("submit")).disabled =
            errorOn;

        if (
            /[a-zA-Z!,!"·$%&/()=?¿|@#~€ ]/.test(e.currentTarget.__data + e.key)
        ) {
            if (
                e.currentTarget.__data == undefined ||
                e.currentTarget.__data == ""
            ) {
                errorOn = /[a-zA-Z!,!"·$%&/()=?¿|@#~€ ]/.test(e.key);
            } else {
                (<HTMLInputElement>document.getElementById("submit")).disabled =
                    true;

                errorOn = true;
            }
        } else {
            (<HTMLInputElement>document.getElementById("submit")).disabled =
                false;

            errorOn = false;
        }
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
        <div class="grid gap-x-24 gap-y-6 grid-cols-2">
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

            <p>
                {#if deleteOn}
                    Performer name:
                    <Link
                        to={`practitionerForm/${practitionerId}`}
                        class="text-lime-700 p-4 font-bold"
                        >{nameStringP}
                    </Link>
                {/if}
            </p>
        </div>
        <div class="grid gap-x-24 gap-y-6 grid-cols-2">
            <div>
                <p class="text-base py-2">Status:</p>
                <button
                    class="text-white font-semibold bg-lime-700 focus:ring-4 focus:ring-gray-700 rounded-lg text-sm px-3 py-2 text-center mr-2 mb-2"
                    id="preliminary"
                    on:click={handleStatus}>Preliminary</button
                >
                <button
                    class="text-white font-semibold bg-lime-700 focus:ring-4 focus:ring-gray-700 rounded-lg text-sm px-3 py-2 text-center mr-2 mb-2"
                    id="final"
                    on:click={handleStatus}>Final</button
                >
                <button
                    class="text-white font-semibold bg-lime-700 focus:ring-4 focus:ring-gray-700 rounded-lg text-sm px-3 py-2 text-center mr-2 mb-2"
                    id="amended"
                    on:click={handleStatus}>Amended</button
                >

                {#if deleteOn}
                    <p class="text-base py-2">
                        Last status registered: {actualStatus}.
                    </p>
                {/if}
            </div>
            <div>
                {#if !deleteOn}
                    <p class="text-base py-2">Performer:</p>
                    <mb-select
                        required
                        id="performer"
                        path="performer[0].reference"
                        placeholder="Select practitioner"
                    >
                        {#if tam != 0}
                            {#each dataP as practitioner}
                                <mb-option
                                    value={`Practitioner/${practitioner.resource.id}`}
                                    label={`${practitioner.resource.name[0].given} ${practitioner.resource.name[0].family}`}
                                />
                            {/each}
                        {:else}
                            <p>No registered practitioners.</p>
                        {/if}
                    </mb-select>
                {/if}
            </div>
        </div>
        <mb-input hidden path="status" id="statusAux" />
        <mb-input
            required
            id="display"
            path="code.coding[0].display"
            label="Observation title"
        />
        <mb-input
            required
            id="note"
            path="note[0].text"
            textarea
            label="Description and Comments "
        />
        <div class="grid gap-x-24 gap-y-6 grid-cols-2">
            <div>
                <mb-input
                    id="vq"
                    path="valueQuantity.value"
                    label="Value Quantity"
                    on:keypress={checkValid}
                />
                <p class="text-sm text-gray-500 py-2">
                    <i
                        ><u
                            >Check value quantity field:</u
                            > Only numbers, '-' or
                            '.'.</i
                    >
                </p>
            </div>
            <mb-input id="units" path="valueQuantity.unit" label="Units" />
        </div>
        <mb-input hidden id="name" path="subject.display" label="Name" />
        <mb-input hidden path="subject.reference" label="Subject" />
        {#if errorOn}
            <p
                class="text-xl font-semibold bg-red-200 shadow-lg border-4 border-red-700 text-left p-6 text-red-600"
            >
                <u>Check quantity field:</u> <br /><br /> Only numbers, '-' or '.'.
            </p>
        {/if}
        {#if issuedOn}
            <p class="text-base py-2">
                Created:
                <br />{created}
            </p>
        {/if}
        {#if lastModOn}
            <p class="text-base py-2">
                Last modified:
                <br />{modified}
            </p>
        {/if}
        <div />
        <div>
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
