<script lang="ts">
    import { onMount } from "svelte";
    import "medblocks-ui";
    import "medblocks-ui/dist/shoelace";
    import { fhir } from "./fhir";
    import { navigate, Link } from "svelte-routing";

    let deleteOn;
    onMount(async () => {
        if (id) {
            const r = await fhir.get(`/PractitionerRole/${id}`);
            const resource = r.data;
            form.import(resource);
            deleteOn = true;
        } else {
            const p = await fhir.get("/PractitionerRole");
            dataPR = await p.data?.entry;
            tamPR = p.data.total;
        }
    });

    let loading: boolean = false;
    export let id;
    let form;
    let dataPR = [];
    let tamPR;
    async function handleSubmit(e: any) {
        loading = true;
        if (id) {
            await fhir.put(`/PractitionerRole/${id}`, { ...e.detail, id });
            navigate("updated", { replace: true });
        } else {
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

    

    let errorOn = false;
    async function checkValid(e: any) {
        (<HTMLInputElement>document.getElementById("submit")).disabled =
            errorOn;
        if (/[0-9!,!¡"·$%&-()=?¿|@#~€]/.test(e.currentTarget.__data + e.key)) {
            (<HTMLInputElement>document.getElementById("submit")).disabled =
                true;

            errorOn = true;
        } else {
            (<HTMLInputElement>document.getElementById("submit")).disabled =
                false;

            errorOn = false;
        }
    }
</script>

<h1 class="text-center text-4xl text-gray-700 font-semibold mb-16">
    Practitioner Role Registration
</h1>
{#if id}
    <br /><br /><br />
    <p class="text-2xl font-semibold bg-lime-200 shadow-lg text-left p-6">
        <u>Important Information:</u> <br /><br /> Once you update or delete a role,
        you must update practitioners who have that role assigned.
    </p>
{/if}

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
            id="display"
            path="specialty[0].coding[0].display"
            label="Role"
            on:keypress={checkValid}
        />
        {#if errorOn}
            <p
                class="text-xl font-semibold bg-red-200 shadow-lg border-4 border-red-700 text-left p-6 text-red-600"
            >
                <u>Check input field:</u> <br /><br /> Numbers or symbols not allowed.
            </p>
        {/if}
        <div>
            <br />
            <mb-submit>
                <button
                    id="submit"
                    class="rounded-xl px-4 py-2 bg-lime-700 text-white"
                    >Submit</button
                >
            </mb-submit>
            {#if deleteOn}
                <Link to=practRoleForm>
                    <button class="rounded-xl px-4 py-2 bg-lime-700 text-white"
                        >Back to list</button
                    >
                </Link>
                <button
                    class="rounded-xl px-4 py-2 bg-orange-900 text-white"
                    on:click={handleDelete}
                    >Delete Practitioner Role
                </button>
            {/if}
        </div>
        <br />
        {#if !deleteOn}
            <h1 class="text-center text-4xl text-gray-700 font-semibold mb-16">
                Current Registered Roles
            </h1>
            <div class="text-center text-xl grid grid-cols-2 gap-8">
                {#if tamPR != 0}
                    {#each dataPR as practRole}
                        <div
                            class="bg-lime-200 shadow-lg text-xl text-left p-12"
                        >
                            <Link
                                to={`practRoleForm/${practRole.resource.id}`}
                                class="text-lime-700 p-4 font-bold"
                                ><i class="fa-solid fa-id-card" />
                            </Link>

                            {practRole.resource.specialty[0].coding[0].display}
                        </div>
                    {/each}
                {:else}
                    <p class="text-xl">No registered roles.</p>
                {/if}
                <br />
            </div>
        {/if}
    </mb-fhir-form>
</div>
