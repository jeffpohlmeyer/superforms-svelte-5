import {PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY} from '$env/static/public';

export async function validate_re_captcha_server(
    token: string,
    fetch: typeof window.fetch,
    secret: string
) {
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        body: `secret=${secret}&response=${token}`
    });
    return await res.json();
}

export async function create_re_captcha_client(
    formToken: string | undefined,
    grecaptcha: any
): Promise<string> {
    return new Promise((resolve) => {
        if (formToken) {
            resolve(formToken);
        } else {
            return grecaptcha.ready(function () {
                grecaptcha
                    .execute(PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY, { action: 'submit' })
                    .then(function (token) {
                        resolve(token);
                    });
            });
        }
    });
}
