<script lang="ts">
    import { PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY } from '$env/static/public';

    import type { PageData } from './$types';
    import SuperDebug, {superForm} from "sveltekit-superforms";
    import {zodClient} from "sveltekit-superforms/adapters";
    import {schema} from "./utils";
    import {create_re_captcha_client} from "$lib/utils/recaptcha";

    type Props = {
        data: PageData;
    };
    let { data }: Props = $props();
    let loading: boolean = $state(false);
    let token: string = $state('')

    const {form, enhance, message, constraints} = superForm(data.form, {
        validators: zodClient(schema),
        onSubmit: async ({ formData }) => {
            loading = true;
            token = await create_re_captcha_client($form.token, window.grecaptcha);
            console.log('token', token);
            formData.set('token', String(token));
        },
        onResult: (res) => {
            console.log('res', res);
            loading = false;
        }
    })
</script>


<svelte:head>
  <script
      src="https://www.google.com/recaptcha/api.js?render={PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY}"
      async
      defer
  ></script>
</svelte:head>

<SuperDebug data={$form} />
{#if $message}
  <h2>{$message.title}</h2>
  <p>{$message.text}</p>
{/if}
<form method="POST" use:enhance>
  <label>
    Name
    <input type="text" {...$constraints.name} name="name" bind:value={$form.name}>
  </label>
  <label>
    Email
    <input type="email" {...$constraints.email} name="email" bind:value={$form.email}>
  </label>
  <label>
    Message
    <textarea {...$constraints.message} name="message" bind:value={$form.message}></textarea>
  </label>
  <input type="hidden" name="token" bind:value={token}>
  <p>{token}</p>
  <button type="submit">
    {#if loading}
      Loading
    {:else}
      Submit
    {/if}
  </button>
</form>
