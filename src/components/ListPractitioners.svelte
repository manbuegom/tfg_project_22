<script lang="ts">
    import { onMount } from "svelte";
    import { fhir } from "./fhir";
    import { Link } from "svelte-routing";

    let data = [];
    let tam;

    onMount(async () => {
        const r = await fhir.get("/Patient");
        data = await r.data?.entry;
        tam = r.data.total;
    });

    function age(e: any) {

        if (e.deceasedDateTime != undefined) {
            var deathDate = new Date(e.deceasedDateTime);
            var birthday = new Date(e.birthDate);
            var age = deathDate.getFullYear() - birthday.getFullYear();
            var m = deathDate.getMonth() - birthday.getMonth();
            if (
                m < 0 ||
                (m === 0 && deathDate.getDate() < birthday.getDate())
            ) {
                age--;
            }
            return age;
            
        } else {
            var today = new Date();
            var birthday = new Date(e.birthDate);
            var age = today.getFullYear() - birthday.getFullYear();
            var m = today.getMonth() - birthday.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
                age--;
            }
            return age;
        }
    }

    function genderFormat(e: any) {
        let genderFL = e.charAt(0).toUpperCase();
        return "" + genderFL + e.slice(1) + "";
    }

</script>

<div class="container">
    <h1 class="text-center text-4xl text-gray-700 font-semibold mb-16">
        Patients
    </h1>
    <div class="text-center text-xl flex flex-col gap-4">
        {#if tam != 0}
            {#each data as patient}
                <div
                    class="grid grid-cols-3 bg-lime-200 shadow-lg text-xl text-left p-6"
                >
                    {#if patient.resource.deceasedDateTime != undefined}           
                        <div>
                            <Link
                                to={`patientForm/${patient.resource.id}`}
                                class="text-lime-700 p-4 font-bold"
                                ><i class="fa-solid fa-id-card" /> Patient Details
                            </Link> <br /><br />
                            <Link
                                to={`observationList/${patient.resource.id}`}
                                class="text-lime-700 p-4 font-bold"
                                ><i class="fa-solid fa-file-medical" /> Observations
                            </Link>
                        </div>
                        {patient.resource.name[0].given}
                        {patient.resource.name[0].family}<br />
                        ({patient.resource.birthDate})
                        <br />
                        {genderFormat(patient.resource.gender)}
                        <div>
                            <p>Deceased date:</p>
                            {patient.resource.deceasedDateTime}
                            <br />
                            At age: {age(patient.resource)}
                        </div>
                    {:else}
                        <div>
                            <Link
                                to={`patientForm/${patient.resource.id}`}
                                class="text-lime-700 p-4 font-bold"
                                ><i class="fa-solid fa-id-card" /> Patient Details
                            </Link> <br /><br />
                            <Link
                                to={`observationList/${patient.resource.id}`}
                                class="text-lime-700 p-4 font-bold"
                                ><i class="fa-solid fa-file-medical" /> Observations
                            </Link>
                        </div>
                        {patient.resource.name[0].given}
                        {patient.resource.name[0].family}<br />
                        {age(patient.resource)} ({patient.resource.birthDate})
                        <br />{genderFormat(patient.resource.gender)}
                        <div>
                            {patient.resource.address[0].state},
                            {patient.resource.telecom[0].value}
                            {#if patient.resource.telecom[1] == undefined}
                                <br /> Email no registered for this patient.
                            {:else}
                                <br /> {patient.resource.telecom[1].value}
                            {/if}
                            <br />
                            <Link to={"mensajito bro"} class="text-lime-700"
                                ><i class="fa-solid fa-envelope" /> Contact via e-mail
                            </Link>
                        </div>
                    {/if}
                </div>
            {/each}
        {:else}
            <p>No registered patients.</p>
        {/if}
        <br />
    </div>
    <div>
        <Link to="patientForm">
            <button
                class="animate-none rounded-xl px-4 py-2 bg-lime-700 text-white"
                >New Patient</button
            >
        </Link>
    </div>
</div>
