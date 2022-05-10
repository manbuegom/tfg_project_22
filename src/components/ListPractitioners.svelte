<script lang="ts">
    import { onMount } from "svelte";
    import { fhir } from "./fhir";
    import { Link } from "svelte-routing";

    let data = [];
    let tam;

    onMount(async () => {
        const r = await fhir.get("/Practitioner");
        data = await r.data?.entry;
        tam = r.data.total;
    });

    function genderFormat(e: any) {
        let genderFL = e.charAt(0).toUpperCase();
        return "" + genderFL + e.slice(1) + "";
    }
</script>

<h1 class="text-center text-4xl text-gray-700 font-semibold mb-16">
    Practitioners
</h1>
<div class="text-center text-xl flex flex-col gap-4">
    {#if tam != 0}
        {#each data as practitioner}
            <div
                class="grid grid-cols-3 bg-lime-200 shadow-lg text-xl text-left p-6"
            >
                <div>
                    <br />
                    <Link
                        to={`practitionerForm/${practitioner.resource.id}`}
                        class="text-lime-700 p-4 font-bold"
                        ><i class="fa-solid fa-id-card" /> Practitioner Details
                    </Link>
                </div>
                {practitioner.resource.name[0].given}
                {practitioner.resource.name[0].family}<br />
                {practitioner.resource.qualification[0].identifier[0].value}
                <br />
                {genderFormat(practitioner.resource.gender)}
                <div>
                    {practitioner.resource.telecom[0].value}
                    {#if practitioner.resource.telecom[1] == undefined}
                        <br /> Email no registered for this practitioner.
                    {:else}
                        <br /> {practitioner.resource.telecom[1].value}
                    {/if}
                    <br />
                    <Link to={"mensajito bro"} class="text-lime-700"
                        ><i class="fa-solid fa-envelope" /> Contact via e-mail
                    </Link>
                </div>
            </div>
        {/each}
    {:else}
        <p>No registered practitioners.</p>
    {/if}
    <br />
</div>
<div>
    <Link to="practitionerForm">
        <button class="animate-none rounded-xl px-4 py-2 bg-lime-700 text-white"
            >New Practitioner</button
        >
    </Link>
</div>
