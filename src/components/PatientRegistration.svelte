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
            if (
                (<HTMLInputElement>document.getElementById("genderAux"))
                    .value == lastGenderRegistered ||
                (<HTMLInputElement>document.getElementById("genderAux"))
                    .value == undefined
            ) {
                e.detail.gender = lastGenderRegistered;
            } else {
                e.detail.gender = (<HTMLInputElement>(
                    document.getElementById("genderAux")
                )).value;
            }
            debugger;
            await fhir.put(`/Patient/${id}`, { ...e.detail, id });
            navigate("updated", { replace: true });
        } else {
            e.detail.gender = (<HTMLInputElement>(
                document.getElementById("genderAux")
            )).value;
            await fhir.post("/Patient", e.detail);
            navigate("patientForm/added", { replace: true });
        }
        loading = false;
    }
    async function handleDelete(e: any) {
        loading = true;
        if (id) {
            await fhir.delete(`/Patient/${id}`, { ...e.detail, id });
            navigate("deleted", { replace: true });
        }
        loading = false;
    }

    async function handleGender(e: any) {
        debugger;
        (<HTMLInputElement>document.getElementById("genderAux")).value =
            e.target.id;
    }

    let observationOn;
    let deleteOn;
    let actualGender;
    let lastGenderRegistered;
    onMount(async () => {
        if (id) {
            const r = await fhir.get(`/Patient/${id}`);
            const resource = r.data;
            form.import(resource);
            lastGenderRegistered = resource.gender;
            let actualGenderFL = lastGenderRegistered.charAt(0).toUpperCase();
            disableFormIfDiceased(resource.deceasedDateTime);
            actualGender =
                "" + actualGenderFL + lastGenderRegistered.slice(1) + "";

            deleteOn = true;
            observationOn = true;
        }
    });

    let deceasedCheck;
    async function disableFormIfDiceased(e: any) {
        if (e != undefined) {
            debugger;
            deceasedCheck = true;
            (<HTMLInputElement>document.getElementById("name")).disabled = e;
            (<HTMLInputElement>document.getElementById("family")).disabled = e;
            (<HTMLInputElement>document.getElementById("birthdate")).disabled =
                e;
            (<HTMLInputElement>(
                document.getElementById("deceasedDate")
            )).disabled = e;
            (<HTMLInputElement>document.getElementById("male")).disabled = e;
            (<HTMLInputElement>document.getElementById("female")).disabled = e;
            (<HTMLInputElement>document.getElementById("other")).disabled = e;
            (<HTMLInputElement>document.getElementById("address")).disabled = e;
            (<HTMLInputElement>document.getElementById("city")).disabled = e;
            (<HTMLInputElement>document.getElementById("state")).disabled = e;
            (<HTMLInputElement>document.getElementById("postalCode")).disabled =
                e;
            (<HTMLInputElement>document.getElementById("emailCheck")).disabled =
                e;
            (<HTMLInputElement>document.getElementById("contact")).disabled = e;
            (<HTMLInputElement>document.getElementById("submit")).disabled = e;
        }
    }

    // let deceasedDate;
    // function displayDeathDate() {
    //     debugger
    //     if (!deceasedDate || deceasedDate == undefined) {
    //         deceasedDate = true;
    //     } else {
    //         deceasedDate = false;
    //     }
    // }
</script>

<h1 class="text-center text-4xl text-gray-700 font-semibold py-4">
    Patient Registration
</h1>
<div>
    <mb-fhir-form
        id="form"
        bind:this={form}
        class="flex flex-col gap-4 py-12 text-gray-700 text-lg font-semibold focus-within:text-lime-700"
        on:mb-submit={handleSubmit}
    >
        <mb-context path="resourceType" data="Patient" />
        <div class="grid gap-x-24 gap-y-6 grid-cols-2">
            <mb-input required id="name" path="name[0].given" label="Name" />
            <mb-input
                required
                id="family"
                path="name[0].family"
                label="Lastname"
            />
            <div>
                <mb-input hidden path="gender" id="genderAux" />
                <mb-date
                    required
                    id="birthdate"
                    label="Date of birth"
                    path="birthDate"
                />
                <br />
                <mb-date
                    id="deceasedDate"
                    label="Death Date"
                    path="deceasedDateTime"
                />
            </div>
            <div>
                <p class="text-base py-2">Gender:</p>
                <button
                    class="text-white font-semibold bg-lime-700 focus:ring-4 focus:ring-gray-700 rounded-lg text-sm px-3 py-2 text-center mr-2 mb-2"
                    id="male"
                    on:click={handleGender}>Male</button
                >
                <button
                    class="text-white font-semibold bg-lime-700 focus:ring-4 focus:ring-gray-700 rounded-lg text-sm px-3 py-2 text-center mr-2 mb-2"
                    id="female"
                    on:click={handleGender}>Female</button
                >
                <button
                    class="text-white font-semibold bg-lime-700 focus:ring-4 focus:ring-gray-700 rounded-lg text-sm px-3 py-2 text-center mr-2 mb-2"
                    id="other"
                    on:click={handleGender}>Other</button
                >

                {#if deleteOn}
                    <p class="text-base py-2">
                        Last gender registered: {actualGender}.
                    </p>
                {/if}
            </div>
            <mb-input
                required
                id="address"
                path="address[0].line"
                label="Address"
            />
            <mb-input required id="city" path="address[0].city" label="City" />
            <mb-input
                required
                id="state"
                path="address[0].state"
                label="State"
            />
            <mb-input
                required
                id="postalCode"
                path="address[0].postalCode"
                label="Postal Code"
            />
            <mb-input path="telecom[1].value" label="Email" id="emailCheck" />
            <mb-count
                required
                id="contact"
                path="telecom[0].value"
                label="Contact"
            />
        </div>
        <div>
            <br />
            <mb-submit>
                <button id="submit" class="rounded-xl px-4 py-2 bg-lime-700 text-white"
                    >Submit</button
                >
            </mb-submit>
            <Link to="patients">
                <button class="rounded-xl px-4 py-2 bg-lime-700 text-white"
                    >Patient's list</button
                >
            </Link>
            {#if observationOn}
                {#if !deceasedCheck}
                    <Link to="observationForm?Patient/{id}">
                        <button
                            class="rounded-xl px-4 py-2 bg-orange-500 text-white"
                            >Add Observation
                        </button>
                    </Link>
                {/if}
            {/if}
            {#if deleteOn}
                <button
                    class="rounded-xl px-4 py-2 bg-orange-900 text-white"
                    on:click={handleDelete}
                    >Delete Patient Data
                </button>
            {/if}
        </div>
    </mb-fhir-form>
</div>
