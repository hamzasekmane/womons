import {useLoaderData, useActionData, useNavigation, Link} from 'react-router';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {motion, AnimatePresence} from 'framer-motion';

/**
 * Meta
 */
export const meta = ({data}) => {
  return [
    {title: `VALORAERPY | ${data?.page.title ?? ''}`},
    {name: 'description', content: data?.page.seo?.description || ''}
  ];
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
  if (!params.handle) throw new Error('Missing page handle');

  const [{page}] = await Promise.all([
    context.storefront.query(PAGE_QUERY, {variables: {handle: params.handle}}),
  ]);

  if (!page) throw new Response('Not Found', {status: 404});

  redirectIfHandleIsLocalized(request, {handle: params.handle, data: page});
  return {page};
}

function loadDeferredData() { return {}; }

/**
 * ACTION (handles POST request)
 */
export async function action({request}) {
  const formData = await request.formData();
  const name = formData.get('name');
  const email = formData.get('email');
  const phone = formData.get('phone');
  const message = formData.get('message');

  // TODO: Wire to your actual email/CRM service
  console.log('Contact form submission:', {name, email, phone, message});

  // Simulate network delay for premium feel
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {success: true};
}

/**
 * Component
 */
export default function Page() {
  const {page} = useLoaderData();
  const isContactPage = page.handle === 'contact';

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-black selection:bg-black selection:text-white">
      {/* Animated Header */}
      <motion.section 
        initial={{opacity: 0, y: -20}} 
        animate={{opacity: 1, y: 0}} 
        transition={{duration: 0.8, ease: [0.16, 1, 0.3, 1]}}
        className="border-b border-gray-200 bg-white"
      >
        <div className="mx-auto max-w-[1600px] px-6 py-16 sm:px-12 sm:py-24">
          <div className="mb-6 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">
            <Link to="/" className="transition-colors hover:text-black">Home</Link>
            <span>/</span>
            <span className="text-black">{page.title}</span>
          </div>

          <h1 className="text-4xl font-light tracking-tight text-black sm:text-6xl font-serif">
            {page.title}
          </h1>
        </div>
      </motion.section>

      {/* Page Content Wrapper */}
      <section className="mx-auto max-w-[1600px] px-6 py-16 sm:px-12 sm:py-24">
        {isContactPage ? (
          <ContactLayout />
        ) : (
          <motion.div 
            initial={{opacity: 0, y: 20}} 
            animate={{opacity: 1, y: 0}} 
            transition={{duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1]}}
            className="mx-auto max-w-4xl"
          >
            {/* High-end Prose wrapper for Shopify Rich Text */}
            <div 
              className="prose prose-lg max-w-none font-light leading-relaxed text-gray-600 prose-headings:font-serif prose-headings:font-light prose-headings:text-black prose-a:text-black prose-a:underline-offset-4 hover:prose-a:text-gray-500"
              dangerouslySetInnerHTML={{__html: page.body}} 
            />
          </motion.div>
        )}
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CONTACT PAGE SPECIFIC LAYOUT
   ═══════════════════════════════════════════════════════════════ */
function ContactLayout() {
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-16 lg:grid-cols-[1fr_1.5fr] lg:gap-32">
      
      {/* Left Column: Contact Info */}
      <motion.div 
        initial={{opacity: 0, x: -30}} 
        animate={{opacity: 1, x: 0}} 
        transition={{duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1]}}
        className="flex flex-col gap-10"
      >
        <div>
          <h2 className="mb-4 text-3xl font-light text-black font-serif">Get in Touch</h2>
          <p className="text-sm font-light leading-relaxed text-gray-500">
            Our Client Care team is available to assist you with styling advice, order inquiries, and product information.
          </p>
        </div>

        <div className="h-px w-full bg-gray-200" />

        <div className="flex flex-col gap-8">
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Email Us</p>
            <a href="mailto:clientcare@valoraerpy.com" className="text-sm font-medium text-black transition-colors hover:text-gray-500">
              clientcare@valoraerpy.com
            </a>
          </div>
          
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Call Us</p>
            <a href="tel:+18001234567" className="text-sm font-medium text-black transition-colors hover:text-gray-500">
              +1 (800) 123-4567
            </a>
            <p className="mt-1 text-xs font-light text-gray-500">Mon-Fri, 9am - 6pm EST</p>
          </div>

          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Flagship Store</p>
            <p className="text-sm font-medium text-black">123 Fashion Avenue</p>
            <p className="mt-1 text-xs font-light text-gray-500">New York, NY 10001</p>
          </div>
        </div>
      </motion.div>

      {/* Right Column: The Form */}
      <motion.div 
        initial={{opacity: 0, x: 30}} 
        animate={{opacity: 1, x: 0}} 
        transition={{duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1]}}
      >
        <AnimatePresence mode="wait">
          {actionData?.success ? (
            <motion.div 
              key="success"
              initial={{opacity: 0, scale: 0.95}}
              animate={{opacity: 1, scale: 1}}
              className="flex h-full flex-col items-center justify-center rounded-[24px] bg-white p-12 text-center shadow-sm border border-gray-100"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-black text-white">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h3 className="mb-4 text-2xl font-light text-black font-serif">Message Sent</h3>
              <p className="text-sm font-light leading-relaxed text-gray-500">
                Thank you for reaching out. A member of our Client Care team will respond to your inquiry shortly.
              </p>
            </motion.div>
          ) : (
            <motion.form 
              key="form"
              method="POST" 
              className="flex flex-col gap-8 rounded-[24px] bg-white p-8 sm:p-12 shadow-sm border border-gray-100"
            >
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                <div className="relative border-b border-gray-300 pb-2 transition-colors focus-within:border-black">
                  <input type="text" name="name" placeholder="Full Name *" required className="w-full bg-transparent text-sm font-light outline-none placeholder:text-gray-400" />
                </div>
                <div className="relative border-b border-gray-300 pb-2 transition-colors focus-within:border-black">
                  <input type="email" name="email" placeholder="Email Address *" required className="w-full bg-transparent text-sm font-light outline-none placeholder:text-gray-400" />
                </div>
              </div>

              <div className="relative border-b border-gray-300 pb-2 transition-colors focus-within:border-black">
                <input type="tel" name="phone" placeholder="Phone Number" className="w-full bg-transparent text-sm font-light outline-none placeholder:text-gray-400" />
              </div>

              <div className="relative border-b border-gray-300 pb-2 transition-colors focus-within:border-black">
                <textarea name="message" placeholder="How can we assist you? *" rows={4} required className="w-full resize-none bg-transparent text-sm font-light outline-none placeholder:text-gray-400" />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group mt-4 relative flex w-full items-center justify-center overflow-hidden rounded-full bg-black px-8 py-5 text-[11px] font-bold uppercase tracking-[0.2em] text-white shadow-lg transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105 hover:bg-gray-900 disabled:scale-100 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center tracking-[0.3em] animate-pulse">
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-3 transition-all duration-500 group-hover:tracking-[0.25em]">
                    Send Message
                    <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                  </span>
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
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
      seo { description title }
    }
  }
`;