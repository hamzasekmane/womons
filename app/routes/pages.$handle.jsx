import {useLoaderData, useActionData} from 'react-router';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

/**
 * Meta
 */
export const meta = ({data}) => {
  return [{title: `Hydrogen | ${data?.page.title ?? ''}`}];
};

/**
 * Loader
 */
export async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, request, params}) {
  if (!params.handle) {
    throw new Error('Missing page handle');
  }

  const [{page}] = await Promise.all([
    context.storefront.query(PAGE_QUERY, {
      variables: {handle: params.handle},
    }),
  ]);

  if (!page) {
    throw new Response('Not Found', {status: 404});
  }

  redirectIfHandleIsLocalized(request, {
    handle: params.handle,
    data: page,
  });

  return {page};
}

function loadDeferredData() {
  return {};
}

/**
 * ✅ ACTION (handles POST request)
 */
export async function action({request}) {
  const formData = await request.formData();

  const name = formData.get('name');
  const email = formData.get('email');
  const phone = formData.get('phone');
  const message = formData.get('message');

  console.log('Contact form submission:', {
    name,
    email,
    phone,
    message,
  });

  return {success: true};
}

/**
 * Component
 */
export default function Page() {
  const {page} = useLoaderData();
  const actionData = useActionData();

  const isContactPage = page.handle === 'contact';

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="mb-10 text-4xl font-light text-center">
        {page.title}
      </h1>

      {isContactPage ? (
        <>
          <form method="POST" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <input
                type="text"
                name="name"
                placeholder="Name"
                className="w-full border p-4"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full border p-4"
                required
              />
            </div>

            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              className="w-full border p-4"
            />

            <textarea
              name="message"
              placeholder="Comment"
              rows={6}
              className="w-full border p-4"
              required
            />

            <button
              type="submit"
              className="bg-black px-8 py-4 text-white hover:opacity-80"
            >
              Submit
            </button>
          </form>

          {actionData?.success && (
            <p className="mt-6 text-center text-green-600">
              ✅ Thank you! Your message has been sent.
            </p>
          )}
        </>
      ) : (
        <div dangerouslySetInnerHTML={{__html: page.body}} />
      )}
    </div>
  );
}

const PAGE_QUERY = `#graphql
  query Page(
    $language: LanguageCode,
    $country: CountryCode,
    $handle: String!
  )
  @inContext(language: $language, country: $country) {
    page(handle: $handle) {
      handle
      id
      title
      body
      seo {
        description
        title
      }
    }
  }
`;