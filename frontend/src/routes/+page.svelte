<script lang="ts">
    import {enhance} from '$app/forms';
    import type {PageData} from './$types';

    let {data}: { data: PageData } = $props();
</script>

<head>
    <title>Balto Source - Reach For The Light</title>
</head>


<div class="mainManu">

    <h1>Balto Source: We are so back!!!!!</h1>
    <br/>
    <br/>
    <p><a href="/signup">sign up</a></p>
    <p><a href="/login">login</a></p>
    <p><a href="/chat">chat</a></p>

</div>

{#each data.resultList as news}
    <p>title: {news.title}</p>
    <p>body: {news.body}</p>
    <p>author: {news.expand?.author.username}</p>
    <p>created: {news.created}</p>
{/each}

<div class="logout">
    <form action="?/logout" method="POST" use:enhance>
        <button type="submit">Logout</button>
    </form>
</div>

<style>

    h1 {
        text-align: center;
        font-size: 50px;
        color: lightblue;
    }

    .mainManu {
        color: lightblue;
    }

    .logout {
        color: lightblue;
    }
</style>