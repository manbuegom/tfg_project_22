<script lang="ts">
    import { Link } from "svelte-routing";

    let queryString = window.location.search.split("?")[1];
</script>

<h1 class="text-center text-5xl">Observation Successfully Registered!</h1>

<Link to="observationList/{queryString}">
    <button
        class="rounded-xl px-4 py-2 bg-lime-700 text-white"
        >Back to list</button
    >
</Link>