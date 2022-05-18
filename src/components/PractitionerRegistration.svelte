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

            if (
                e.detail.qualification[0].identifier[0].value.value !=
                    "Undefined Role" &&
                e.detail.qualification[0].identifier[0].value.value != undefined
            ) {
                (e.detail.identifier = [
                    {
                        value: `${e.detail.qualification[0].identifier[0].value.value}`,
                    },
                ]),
                    (e.detail.qualification = [
                        {
                            identifier: [
                                {
                                    value: `${e.detail.qualification[0].identifier[0].value.value}`,
                                },
                            ],
                        },
                    ]);
            } else {
                (e.detail.identifier = [
                    {
                        value: `${roleName}`,
                    },
                ]),
                    (e.detail.qualification = [
                        {
                            identifier: [
                                {
                                    value: `${roleName}`,
                                },
                            ],
                        },
                    ]);
            }

            await fhir.put(`/Practitioner/${id}`, { ...e.detail, id });
            navigate("updated", { replace: true });
        } else {
            if (
                (<HTMLInputElement>document.getElementById("genderAux"))
                    .value == undefined
            ) {
                e.detail.gender = "unknown";
            } else {
                e.detail.gender = (<HTMLInputElement>(
                    document.getElementById("genderAux")
                )).value;
            }
            if (e.detail.qualification != undefined) {
                (e.detail.identifier = [
                    {
                        value: `${e.detail.qualification[0].identifier[0].value.value}`,
                    },
                ]),
                    (e.detail.qualification = [
                        {
                            identifier: [
                                {
                                    value: `${e.detail.qualification[0].identifier[0].value.value}`,
                                },
                            ],
                        },
                    ]);
            } else {
                (e.detail.identifier = [
                    {
                        value: `${roleName}`,
                    },
                ]),
                    (e.detail.qualification = [
                        {
                            identifier: [
                                {
                                    value: `${roleName}`,
                                },
                            ],
                        },
                    ]);
            }

            await fhir.post("/Practitioner", e.detail);
            navigate("practitionerForm/added", { replace: true });
        }
        loading = false;
    }
    async function handleDelete(e: any) {
        loading = true;
        if (id) {
            await fhir.delete(`/Practitioner/${id}`, { ...e.detail, id });
            navigate("deleted", { replace: true });
        }
        loading = false;
    }

    async function handleGender(e: any) {
        (<HTMLInputElement>document.getElementById("genderAux")).value =
            e.target.id;
    }

    let deleteOn;
    let actualGender;
    let lastGenderRegistered;
    let hasRole, roleName;
    let dataP = [];
    let tam;
    onMount(async () => {
        if (id) {
            const r = await fhir.get(`/Practitioner/${id}`);
            const resource = r.data;
            form.import(resource);
            lastGenderRegistered = resource.gender;
            let actualGenderFL = lastGenderRegistered.charAt(0).toUpperCase();
            actualGender =
                "" + actualGenderFL + lastGenderRegistered.slice(1) + "";

            deleteOn = true;
            roleName = resource.qualification[0].identifier[0].value;
        } else {
            roleName = "Undefined Role";
        }
        const p = await fhir.get("/PractitionerRole");
        dataP = await p.data?.entry;
        tam = p.data.total;
    });

    let errorOn = false;
    async function checkValid(e: any) {
        (<HTMLInputElement>document.getElementById("submit")).disabled =
            errorOn;
        if ((e.currentTarget.__data + e.key).length > 15) {
            (<HTMLInputElement>document.getElementById("submit")).disabled =
                true;

            errorOn = true;
        } else {
            (<HTMLInputElement>document.getElementById("submit")).disabled =
                false;

            errorOn = false;
        }
    }
    let errorOnE;
    async function checkValidEmail(e: any) {
        (<HTMLInputElement>document.getElementById("submit")).disabled =
            errorOnE;
        if (
            !(e.currentTarget.__data + e.key).includes("@") ||
            !(e.currentTarget.__data + e.key).split("@")[1].includes(".")
        ) {
            (<HTMLInputElement>document.getElementById("submit")).disabled =
                true;

            errorOnE = true;
        } else {
            (<HTMLInputElement>document.getElementById("submit")).disabled =
                false;

            errorOnE = false;
        }
    }
</script>

<h1 class="text-center text-4xl text-gray-700 font-semibold py-4">
    Practitioner Registration
</h1>
<div>
    <mb-fhir-form
        id="form"
        bind:this={form}
        class="flex flex-col gap-4 py-12 text-gray-700 text-lg font-semibold focus-within:text-lime-700"
        on:mb-submit={handleSubmit}
    >
        <mb-context path="resourceType" data="Practitioner" />
        <div class="grid gap-x-8 gap-y-6 grid-cols-2">
            <mb-input required id="name" path="name[0].given" label="Name" />
            <mb-input
                required
                id="family"
                path="name[0].family"
                label="Lastname"
            />
            <div>
                <mb-input hidden path="gender" id="genderAux" />
                <mb-input hidden path="identifier.value" id="identifier" />
                <mb-input
                    hidden
                    path="qualification[0].identifier[0].value"
                    id="quaAux"
                />
                <mb-date
                    required
                    id="birthdate"
                    label="Date of birth"
                    path="birthDate"
                />
                <br />
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
        </div>
        <br />
        <div class="grid gap-x-8 gap-y-6 grid-cols-4">
            <mb-input
                required
                id="country"
                path="address[0].country"
                label="Country"
            />
            <mb-input
                required
                id="city"
                path="address[0].city"
                label="City, Capital"
            />
            <mb-input
                required
                id="address"
                path="address[0].line"
                label="Address (Street, Nº)"
            />
            <mb-input
                required
                id="postalCode"
                path="address[0].postalCode"
                label="Postal Code"
            />
            <mb-input
                path="telecom[1].value"
                label="Email"
                id="emailCheck"
                on:keypress={checkValidEmail}
            />
            <mb-count
                required
                id="contact"
                path="telecom[0].value"
                label="Contact"
                on:keypress={checkValid}
            />
        </div>
        {#if errorOn}
            <p
                class="text-xl font-semibold bg-red-200 shadow-lg border-4 border-red-700 text-left p-6 text-red-600"
            >
                <u>Check contact field:</u> <br /><br /> Max lenght: 15.
            </p>
        {/if}
        {#if errorOnE}
            <p
                class="text-xl font-semibold bg-red-200 shadow-lg border-4 border-red-700 text-left p-6 text-red-600"
            >
                <u>Check email field:</u> <br /><br /> Either '@' or '.' are missing.
            </p>
        {/if}
        <div>
            <br />
            {#if deleteOn}
                <p class="text-2xl py-2">Practitioner Role: {roleName}</p>
                <br />
            {:else}
                <p class="text-base py-2">Practitioner Role</p>
                <br />
            {/if}

            <mb-select
                id="practRole"
                path="qualification[0].identifier[0].value"
                placeholder="Select a role or update the current one"
            >
                {#if tam != 0}
                    {#each dataP as practRole}
                        <mb-option
                            value={`${practRole.resource.specialty[0].coding[0].display}`}
                            label={`${practRole.resource.specialty[0].coding[0].display}`}
                        />
                    {/each}
                {:else}
                    <br />
                    <p>No registered roles.</p>
                {/if}
            </mb-select>
        </div>
        <div>
            <br />
            <mb-submit>
                <button
                    id="submit"
                    class="rounded-xl px-4 py-2 bg-lime-700 text-white"
                    >Submit</button
                >
            </mb-submit>
            <Link to="practitioners">
                <button class="rounded-xl px-4 py-2 bg-lime-700 text-white"
                    >Practitioner's list</button
                >
            </Link>
            {#if deleteOn}
                <button
                    class="rounded-xl px-4 py-2 bg-orange-900 text-white"
                    on:click={handleDelete}
                    >Delete Practitioner Data
                </button>
            {/if}
        </div>
    </mb-fhir-form>
</div>
