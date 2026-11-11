import type { Metadata } from "next";
import LegalPage, { LegalLink, LegalList, type LegalSection } from "@/components/legal/LegalPage";
import { siteConfig } from "@/config/siteConfig";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description: `What personal data ${siteConfig.name} collects, why, who it's shared with, and your rights.`,
  path: "/privacy",
});

// DRAFT — written to match the data the site actually handles today; have a lawyer review it before launch.
const LAST_UPDATED = "11 November 2026";

const { name, legalName, contact, location } = siteConfig;
const address = `${location.addressLine1}, ${location.addressLine2}, ${location.city}, ${location.state} ${location.postalCode}, ${location.country}`;
const email = <LegalLink href={`mailto:${contact.email}`}>{contact.email}</LegalLink>;

const sections: LegalSection[] = [
  {
    id: "who",
    title: "Who we are",
    body: (
      <>
        <p>
          {legalName} (&ldquo;{name}&rdquo;, &ldquo;we&rdquo;) runs this website and decides how your personal data is
          used. Under India&apos;s Digital Personal Data Protection Act, 2023 we are the &ldquo;Data Fiduciary&rdquo; for
          that data.
        </p>
        <p>Registered office: {address}.</p>
      </>
    ),
  },
  {
    id: "collect",
    title: "What we collect",
    body: (
      <>
        <LegalList>
          <li>
            <strong>Account details</strong>: your name, mobile number, email address and password (stored only in
            scrambled, hashed form).
          </li>
          <li>
            <strong>Orders</strong>: delivery name, address, PIN code and phone number, what you bought, prices, coupon
            used, and the order&apos;s status and history.
          </li>
          <li>
            <strong>Payments</strong>: whether a payment succeeded and its reference number. Card, UPI and bank details are
            handled by our payment partners; we never receive or store them.
          </li>
          <li>
            <strong>Things you send us</strong>: reviews, support requests and messages.
          </li>
          <li>
            <strong>Saved items</strong>: your cart and wishlist (in your account, or in your browser if you shop as a
            guest).
          </li>
          <li>
            <strong>Usage data</strong>: pages viewed, products added to cart, device, browser and approximate location
            (city level), collected through analytics. See &ldquo;Cookies&rdquo; below.
          </li>
        </LegalList>
        <p>We don&apos;t ask for sensitive information such as health data, and we don&apos;t need your Aadhaar or PAN.</p>
      </>
    ),
  },
  {
    id: "use",
    title: "How we use it",
    body: (
      <LegalList>
        <li>To take, pack, deliver and support your orders, and to process cancellations, returns and refunds.</li>
        <li>To issue invoices and keep the tax and accounting records the law requires.</li>
        <li>To run your account, wishlist and cart, and answer your messages.</li>
        <li>To show reviews you have chosen to publish.</li>
        <li>To prevent fraud and misuse of offers, and to keep the site secure.</li>
        <li>To understand which pages and products are popular so we can improve the shop.</li>
        <li>To send offers by email or WhatsApp, only if you have agreed; you can stop them at any time.</li>
      </LegalList>
    ),
  },
  {
    id: "basis",
    title: "Why we're allowed to",
    body: (
      <p>
        We process your data with your consent, or where the law allows it without separate consent: for example to
        complete a purchase you asked for, or to meet legal duties such as GST record-keeping. Where we rely on consent you
        can withdraw it at any time; this doesn&apos;t affect what was done before.
      </p>
    ),
  },
  {
    id: "cookies",
    title: "Cookies and browser storage",
    body: (
      <>
        <p>We use a small amount of storage in your browser:</p>
        <LegalList>
          <li>
            <strong>Essential</strong>: keeps you signed in, remembers your cart and (for guests) your wishlist, and the
            PIN code you last checked for delivery. The site needs these to work.
          </li>
          <li>
            <strong>Analytics</strong>: Google Analytics, loaded through Google Tag Manager, tells us how the site is used
            (for example the most viewed products). It sets cookies from Google.
          </li>
        </LegalList>
        <p>
          You can block or delete cookies in your browser settings. Blocking analytics won&apos;t stop you shopping;
          clearing essential storage will sign you out and empty a guest cart.
        </p>
      </>
    ),
  },
  {
    id: "share",
    title: "Who we share it with",
    body: (
      <>
        <p>
          <strong>We never sell your personal data.</strong> We share only what each partner needs to do their job:
        </p>
        <LegalList>
          <li>
            <strong>Couriers</strong>: your name, delivery address and phone number, and the amount to collect for cash on
            delivery.
          </li>
          <li>
            <strong>Payment partners</strong>: the order amount and reference, to take your payment and make refunds.
          </li>
          <li>
            <strong>Technology providers</strong> that host our website, database, images and email, such as cloud hosting
            and storage services.
          </li>
          <li>
            <strong>Google</strong>, for the analytics described above.
          </li>
          <li>
            <strong>Authorities</strong>, when the law requires it, for example tax authorities or a court order.
          </li>
        </LegalList>
      </>
    ),
  },
  {
    id: "where",
    title: "Where it's stored",
    body: (
      <p>
        Our main database and images are stored with cloud providers in India (Mumbai region). Some providers, such as
        analytics and website hosting, may process data in other countries, as permitted by Indian law, under contracts
        that require them to protect it.
      </p>
    ),
  },
  {
    id: "keep",
    title: "How long we keep it",
    body: (
      <LegalList>
        <li>
          <strong>Orders and invoices</strong>: as long as tax and company law requires (currently up to 8 years), even
          if you close your account.
        </li>
        <li>
          <strong>Your account</strong>: until you ask us to close it, or after a long period of no activity.
        </li>
        <li>
          <strong>Support messages</strong>: for as long as needed to resolve the request and for a reasonable time after.
        </li>
        <li>
          <strong>Analytics</strong>: for the retention period set in our Google Analytics account (at most 14
          months).
        </li>
      </LegalList>
    ),
  },
  {
    id: "security",
    title: "How we protect it",
    body: (
      <p>
        Data travels over encrypted connections (HTTPS), passwords are hashed, and access to customer data is limited to
        staff who need it. No system is perfectly secure; if a breach affects your data, we will tell you and the
        authorities as the law requires.
      </p>
    ),
  },
  {
    id: "rights",
    title: "Your rights",
    body: (
      <>
        <p>Under the Digital Personal Data Protection Act, 2023 you can:</p>
        <LegalList>
          <li>ask what personal data we hold about you and how it is used;</li>
          <li>ask us to correct, complete or update it;</li>
          <li>ask us to erase it (except what we must keep by law, such as invoices);</li>
          <li>withdraw consent, for example to marketing;</li>
          <li>nominate someone to act for you if you are unable to;</li>
          <li>complain to our Grievance Officer, and then to the Data Protection Board of India.</li>
        </LegalList>
        <p>
          Write to {email} from the email or phone linked to your account. We&apos;ll reply within 30 days. You can
          already update your addresses in <LegalLink href="/account">My Account</LegalLink>.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "Children",
    body: (
      <p>
        Our shop is meant for adults. We don&apos;t knowingly collect data from anyone under 18 without a parent&apos;s or
        guardian&apos;s consent; if you think a child has given us data, contact us and we will delete it.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: (
      <p>
        We&apos;ll update this policy when our practices change, and show the new date at the top. For significant changes
        we&apos;ll let account holders know by email.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Grievance Officer and contact",
    body: (
      <>
        <p>For any privacy question, request or complaint:</p>
        <LegalList>
          <li>Grievance Officer, {legalName} (name to be published before launch)</li>
          <li>Email: {email}</li>
          <li>Phone: {contact.phone} ({contact.supportHours})</li>
          <li>Address: {address}</li>
        </LegalList>
      </>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      summary="What personal data we collect, why we need it, who sees it, and how you stay in control."
      lastUpdated={LAST_UPDATED}
      sections={sections}
      related={[
        { href: "/terms", label: "Terms and Conditions" },
        { href: "/shipping", label: "Shipping Policy" },
        { href: "/returns", label: "Returns Policy" },
      ]}
    />
  );
}
