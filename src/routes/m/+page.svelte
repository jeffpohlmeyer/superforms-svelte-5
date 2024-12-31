<script lang="ts">
    import { PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY } from '$env/static/public';
    import {enhance} from '$app/forms'
    import type { PageData } from './$types';
    import SuperDebug, {superForm} from "sveltekit-superforms";
    import {zodClient} from "sveltekit-superforms/adapters";
    import {schema} from "$lib/utils/schema";
    import {create_re_captcha_client} from "$lib/utils/recaptcha";

    type Props = {
        data: PageData;
    };
    let { data }: Props = $props();
    let loading: boolean = $state(false);

    const {message, constraints} = superForm(data.form, {
        validators: zodClient(schema),
    })
</script>


<svelte:head>
  <script
      src="https://www.google.com/recaptcha/api.js?render={PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY}"
      async
      defer
  ></script>
</svelte:head>

{#if $message}
  <h2>{$message.title}</h2>
  <p>{$message.text}</p>
{/if}
<form method="POST" use:enhance={async ({ formData }) => {
		loading = true;
		const token = await create_re_captcha_client(formData.get('token'), window.grecaptcha);
		formData.append('token', String(token));
		return async ({ update }) => {
			update();
			loading = false;
		};
	}
}>
  <label>
    Name
    <input type="text" {...$constraints.name} name="name">
  </label>
  <label>
    Email
    <input type="email" {...$constraints.email} name="email">
  </label>
  <label>
    Message
    <textarea {...$constraints.message} name="message"></textarea>
  </label>
  <button type="submit">
    {#if loading}
      Loading
    {:else}
      Submit
    {/if}
  </button>
</form>
