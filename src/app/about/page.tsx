import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { usersRepo } from "@/lib/db";

export const metadata: Metadata = { title: "About — Healing Hands Spa" };

const SPECIALTIES: Record<string, string> = {
  "adele@healinghandsspa.com": "Founder & Lead Therapist",
  "marcus@healinghandsspa.com": "Swedish & Aromatherapy",
  "jasmine@healinghandsspa.com": "Prenatal Specialist",
  "rosa@healinghandsspa.com": "Hot Stone Therapy",
  "liam@healinghandsspa.com": "Deep Tissue & Sports",
};

export default async function AboutPage(): Promise<JSX.Element> {
  const team = usersRepo.list().filter((u) => u.role === "provider" || u.role === "admin");

  return (
    <>
      <section className="container-content py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow">Our story</p>
            <h1 className="display-h1 mt-4">Founded on stillness.</h1>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="text-lg leading-relaxed text-ink-light">
              In 2013, Adele Thaxton set up a single massage table in a sun-warmed back room on
              Main Street. She had no receptionist, no waiting area, and a strict rule: never
              book back-to-back sessions. Twelve years on, the rule still holds.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-ink-light">
              We are now five therapists, a house line of botanicals called{" "}
              <em>Essentially Yours</em>, and a continuing-education program that draws practitioners
              from across the state. What hasn&apos;t changed: every appointment gets the full hour.
              No rushing. No upselling. Just the work.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-cream-50 py-24">
        <div className="container-content">
          <p className="eyebrow">The team</p>
          <h2 className="display-h2 mt-3">Five people, one practice.</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => (
              <div key={member.id} className="text-center">
                <div className="relative mx-auto h-40 w-40 overflow-hidden rounded-full">
                  <Image
                    src={member.avatar_url}
                    alt={member.display_name}
                    fill
                    className="object-cover"
                    sizes="160px"
                  />
                </div>
                <p className="mt-4 font-display text-xl">{member.display_name}</p>
                <p className="mt-1 text-sm text-ink-light">
                  {SPECIALTIES[member.email] ?? "Licensed Massage Therapist"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-content py-24 text-center">
        <p className="eyebrow">Find us</p>
        <h2 className="display-h2 mt-3">327 Main Street · Middletown, DE 19709</h2>
        <p className="mt-4 text-ink-light">Tuesday – Saturday · 9 am – 6 pm</p>
        <p className="mt-1 text-ink-light">(302) 555-0139</p>
        <Link href="/book" className="btn-primary mt-8">
          Book an appointment
        </Link>
      </section>
    </>
  );
}
