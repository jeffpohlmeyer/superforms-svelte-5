import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';
import { GOOGLE_RECAPTCHA_SECRET_KEY } from '$env/static/private';
import { validate_re_captcha_server } from '$lib/utils/recaptcha';

import type { Actions, PageServerLoad, RequestEvent } from './$types';
import {schema} from "$lib/utils/schema";

export const load: PageServerLoad = async () => {

    return { form: await superValidate(zod(schema)) };
};

export const actions: Actions = {
    default: async (event: RequestEvent) => {
        const form = await superValidate(event.request, zod(schema));
        console.log('form.valid', form.valid);
        if (!form.valid) {
            return fail(400, { form });
        }

        // reCAPTCHA
        const gToken = form.data.token;
        if (!gToken) {
            return message(form, {
                type: 'error',
                title: 'Invalid reCAPTCHA',
                text: 'There was an error with the reCAPTCHA on your form submission. Please try again later.'
            });
        }
        const res = await validate_re_captcha_server(gToken, fetch, GOOGLE_RECAPTCHA_SECRET_KEY);
        if (!res.success) {
            return message(form, {
                type: 'error',
                title: 'Failed reCAPTCHA',
                text: 'There was an error with the reCAPTCHA on your form submission. Please try again later.'
            });
        }
        return { form };
    }
};
