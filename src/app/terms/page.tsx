import type { Metadata } from "next";
import LegalPage, { LegalLink, LegalList, type LegalSection } from "@/components/legal/LegalPage";
import { siteConfig } from "@/config/siteConfig";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Terms and Conditions",
  description: `The terms for buying from ${siteConfig.name} and using our website.`,
  path: "/terms",
});

// DRAFT — written to match how the shop works today; have a lawyer review it before launch.
const LAST_UPDATED = "11 November 2026";

const { name, legalName, contact, location } = siteConfig;
const address = `${location.addressLine1}, ${location.addressLine2}, ${location.city}, ${location.state} ${location.postalCode}, ${location.country}`;
const email = <LegalLink href={`mailto:${contact.email}`}>{contact.email}</LegalLink>;

const sections: LegalSection[] = [
  {
    id: "about",
    title: "About these terms",
    body: (
      <>
        <p>
          This website is run by <strong>{legalName}</strong> (&ldquo;{name}&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;),
          with its registered office at {address}.
        </p>
        <p>
          These terms apply when you browse the site, create an account or buy from us. By placing an order you confirm
          that you have read and agree to them, together with our <LegalLink href="/privacy">Privacy Policy</LegalLink>,{" "}
          <LegalLink href="/shipping">Shipping Policy</LegalLink> and <LegalLink href="/returns">Returns Policy</LegalLink>.
        </p>
        <p>You must be at least 18 years old to place an order, or have a parent or guardian place it for you.</p>
      </>
    ),
  },
  {
    id: "account",
    title: "Your account",
    body: (
      <>
        <p>
          You can shop as a guest or with an account. If you create one, please give accurate details and keep your
          password private: you are responsible for activity on your account. Tell us straight away at {email} if you
          think someone else has used it.
        </p>
        <p>We may suspend or close accounts used for fraud, abuse of offers or breaking these terms.</p>
      </>
    ),
  },
  {
    id: "handloom",
    title: "Our sarees: handwoven by nature",
    body: (
      <>
        <p>
          Our sarees are handwoven by weavers across Bengal. Small irregularities in the weave, slight differences in
          colour between pieces, and the odd loose thread are natural features of handloom work, not defects.
        </p>
        <LegalList>
          <li>
            We photograph every saree carefully, but colours can look slightly different on your screen than in daylight.
          </li>
          <li>Lengths and widths are approximate and may vary by a few centimetres.</li>
          <li>Whether a blouse piece is included is shown on each product page.</li>
        </LegalList>
      </>
    ),
  },
  {
    id: "prices",
    title: "Prices and taxes",
    body: (
      <>
        <p>
          All prices are in Indian Rupees (₹) and <strong>include GST</strong>. Any delivery charge is shown at checkout
          before you pay.
        </p>
        <p>
          We work hard to keep prices accurate. If an item is listed at an obviously wrong price, we may cancel the order
          and refund any amount you have paid in full, even after it has been confirmed.
        </p>
      </>
    ),
  },
  {
    id: "orders",
    title: "Placing an order",
    body: (
      <>
        <p>
          When you place an order you receive an order number (for example <em>OD261108482913</em>). Your order is an
          offer to buy; a contract is formed when we <strong>confirm</strong> it, which happens once payment is received
          or, for cash on delivery, once we accept it.
        </p>
        <p>We may decline or cancel an order, with a full refund of anything paid, if for example:</p>
        <LegalList>
          <li>the item has sold out or is damaged before dispatch;</li>
          <li>we cannot deliver to the address given;</li>
          <li>the order looks fraudulent or breaks the terms of an offer.</li>
        </LegalList>
      </>
    ),
  },
  {
    id: "payment",
    title: "Payment and offers",
    body: (
      <>
        <LegalList>
          <li>
            <strong>Online payments</strong> are processed by our payment partners. We never see or store your full card or
            bank details.
          </li>
          <li>
            <strong>Cash on delivery</strong>, where offered, must be paid in full to the courier when the parcel arrives.
            Repeatedly refusing COD parcels may lead us to switch off COD for your account.
          </li>
          <li>
            <strong>Coupon codes</strong>: one per order, subject to the conditions shown with each code (minimum order,
            dates, number of uses). They have no cash value and can&apos;t be exchanged or combined. If an order using a
            coupon is cancelled, the coupon use is returned.
          </li>
        </LegalList>
      </>
    ),
  },
  {
    id: "delivery",
    title: "Shipping and delivery",
    body: (
      <>
        <p>
          We currently deliver within India. Delivery times are estimates and are set out in our{" "}
          <LegalLink href="/shipping">Shipping Policy</LegalLink>; delays caused by couriers, weather or other events
          outside our control can happen.
        </p>
        <p>
          Please check that the parcel is sealed and undamaged before accepting it. Responsibility for the parcel passes to
          you when it is delivered to the address you gave.
        </p>
      </>
    ),
  },
  {
    id: "cancellations",
    title: "Cancelling an order",
    body: (
      <>
        <p>
          You can cancel an order yourself from <LegalLink href="/account/orders">My Orders</LegalLink> until it has been
          packed. After that, contact us and we&apos;ll do our best to help.
        </p>
        <p>If you paid online, a refund to your original payment method starts as soon as the cancellation is confirmed.</p>
      </>
    ),
  },
  {
    id: "returns",
    title: "Returns, exchanges and refunds",
    body: (
      <p>
        If something isn&apos;t right, our <LegalLink href="/returns">Returns Policy</LegalLink> explains which items can
        be returned or exchanged, the time limits, and how refunds are paid. Nothing in these terms affects your rights
        under the Consumer Protection Act, 2019.
      </p>
    ),
  },
  {
    id: "invoices",
    title: "Invoices",
    body: (
      <p>
        Every confirmed order has an invoice, which you can download as a PDF from{" "}
        <LegalLink href="/account/orders">My Orders</LegalLink>, or from <LegalLink href="/track">Track order</LegalLink>{" "}
        if you checked out as a guest.
      </p>
    ),
  },
  {
    id: "reviews",
    title: "Reviews and what you post",
    body: (
      <>
        <p>
          We welcome honest reviews. By posting one you allow us to show it on our website, with your first name and
          initial. Reviews are checked before they appear, and we may decline ones that are abusive, off-topic, contain
          personal details or advertise other businesses.
        </p>
        <p>Please don&apos;t post anything you don&apos;t have the right to share.</p>
      </>
    ),
  },
  {
    id: "use",
    title: "Using our website",
    body: (
      <>
        <p>Please don&apos;t:</p>
        <LegalList>
          <li>use the site for anything unlawful or fraudulent;</li>
          <li>try to access other people&apos;s accounts or orders, or interfere with how the site works;</li>
          <li>copy our catalogue or prices with automated tools without our written permission.</li>
        </LegalList>
      </>
    ),
  },
  {
    id: "ip",
    title: "Our content",
    body: (
      <p>
        The {name} name and logo, our photographs, product descriptions and the design of this website belong to us or
        our licensors. You may share links to our pages, but please don&apos;t reuse our photos or text without asking.
      </p>
    ),
  },
  {
    id: "liability",
    title: "Our responsibility to you",
    body: (
      <>
        <p>
          If we fail to meet these terms, we are responsible for loss you suffer that was a foreseeable result of our
          failure, up to the amount you paid for the order concerned. We are not responsible for losses we could not have
          foreseen, or for delays caused by events outside our reasonable control.
        </p>
        <p>Nothing here limits any liability that cannot be limited by law.</p>
      </>
    ),
  },
  {
    id: "law",
    title: "Governing law and disputes",
    body: (
      <p>
        These terms are governed by the laws of India. If a dispute can&apos;t be settled through our support team or the
        Grievance Officer below, the courts at Kolkata, West Bengal will have jurisdiction, without affecting your right
        to approach a consumer commission.
      </p>
    ),
  },
  {
    id: "grievance",
    title: "Grievance Officer",
    body: (
      <>
        <p>
          Under the Consumer Protection (E-Commerce) Rules, 2020, you can raise a complaint with our Grievance Officer:
        </p>
        <LegalList>
          <li>Grievance Officer, {legalName} (name to be published before launch)</li>
          <li>Email: {email}</li>
          <li>Phone: {contact.phone} ({contact.supportHours})</li>
          <li>Address: {address}</li>
        </LegalList>
        <p>We acknowledge complaints within 48 hours and aim to resolve them within one month.</p>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes to these terms",
    body: (
      <p>
        We may update these terms from time to time; the date at the top shows the latest version. The terms in force when
        you place an order are the ones that apply to it.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms and Conditions"
      summary={`The rules for buying from ${name} and using our website, in plain language.`}
      lastUpdated={LAST_UPDATED}
      sections={sections}
      related={[
        { href: "/privacy", label: "Privacy Policy" },
        { href: "/shipping", label: "Shipping Policy" },
        { href: "/returns", label: "Returns Policy" },
      ]}
    />
  );
}
