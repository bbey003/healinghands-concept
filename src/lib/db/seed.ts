import bcrypt from "bcryptjs";
import { store, generateId, nowIso } from "./store";
import type { User, Service, Product, AvailabilityRule, Booking } from "@/types";

const FIXED_IDS = {
  adele: "u-adele-0001",
  marcus: "u-marcus-0002",
  jasmine: "u-jasmine-0003",
  rosa: "u-rosa-0004",
  liam: "u-liam-0005",
  demoUser: "u-demo-0006",
} as const;

function makeUser(
  id: string,
  email: string,
  display_name: string,
  role: User["role"],
  avatar_url: string,
): User {
  return {
    id,
    email,
    display_name,
    avatar_url,
    role,
    status: "active",
    email_verified_at: nowIso(),
    last_sign_in_at: null,
    created_at: nowIso(),
    updated_at: nowIso(),
  };
}

export function seedAll(): void {
  if (store.seeded) return;
  store.seeded = true;

  const passwordHash = bcrypt.hashSync("spa-demo-2026", 10);

  const team: User[] = [
    makeUser(
      FIXED_IDS.adele,
      "adele@healinghandsspa.com",
      "Adele Thaxton",
      "admin",
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
    ),
    makeUser(
      FIXED_IDS.marcus,
      "marcus@healinghandsspa.com",
      "Marcus Bellweather",
      "provider",
      "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=400&fit=crop",
    ),
    makeUser(
      FIXED_IDS.jasmine,
      "jasmine@healinghandsspa.com",
      "Jasmine Okafor",
      "provider",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
    ),
    makeUser(
      FIXED_IDS.rosa,
      "rosa@healinghandsspa.com",
      "Rosa Linden",
      "provider",
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop",
    ),
    makeUser(
      FIXED_IDS.liam,
      "liam@healinghandsspa.com",
      "Liam Cassidy",
      "provider",
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop",
    ),
    makeUser(
      FIXED_IDS.demoUser,
      "demo@healinghandsspa.com",
      "Demo Guest",
      "user",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    ),
  ];

  store.users.push(...team);
  for (const u of team) {
    store.credentials.push({ user_id: u.id, password_hash: passwordHash });
  }

  const services: Service[] = [
    {
      id: "s-swedish",
      provider_id: FIXED_IDS.marcus,
      name: "Swedish Massage",
      slug: "swedish-massage",
      description: "Long, gliding strokes that ease tension and improve circulation.",
      long_description:
        "Our signature 60-minute Swedish massage uses warm jojoba oil and our house-blended essential oils. Long flowing strokes melt muscle tension while leaving you in a deeply restorative state. Recommended for first-time clients and anyone seeking gentle relaxation.",
      duration_minutes: 60,
      price_cents: 11500,
      buffer_after_minutes: 15,
      max_advance_days: 60,
      cancellation_cutoff_hours: 24,
      is_active: true,
      category: "massage",
      image_url:
        "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=600&fit=crop",
      created_at: nowIso(),
    },
    {
      id: "s-deep-tissue",
      provider_id: FIXED_IDS.liam,
      name: "Deep Tissue Massage",
      slug: "deep-tissue-massage",
      description: "Focused pressure to release chronic tension in deeper muscle layers.",
      long_description:
        "Targets the deep layers of muscle and fascia. Slower, more deliberate strokes using forearms and elbows to address chronic patterns of tension. Ideal for athletes, manual workers, and anyone with persistent knots.",
      duration_minutes: 75,
      price_cents: 14000,
      buffer_after_minutes: 15,
      max_advance_days: 60,
      cancellation_cutoff_hours: 24,
      is_active: true,
      category: "massage",
      image_url:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
      created_at: nowIso(),
    },
    {
      id: "s-prenatal",
      provider_id: FIXED_IDS.jasmine,
      name: "Prenatal Massage",
      slug: "prenatal-massage",
      description: "Side-lying support for the second and third trimesters.",
      long_description:
        "Our certified prenatal therapist uses pillow bolsters and side-lying positioning to safely relieve the unique aches of pregnancy. Light to medium pressure, focused on lower back, hips, and shoulders.",
      duration_minutes: 60,
      price_cents: 12500,
      buffer_after_minutes: 15,
      max_advance_days: 60,
      cancellation_cutoff_hours: 24,
      is_active: true,
      category: "prenatal",
      image_url:
        "https://images.unsplash.com/photo-1591343395082-e120087004b4?w=800&h=600&fit=crop",
      created_at: nowIso(),
    },
    {
      id: "s-hot-stone",
      provider_id: FIXED_IDS.rosa,
      name: "Hot Stone Therapy",
      slug: "hot-stone-therapy",
      description: "Smooth basalt stones placed along energy points for deep release.",
      long_description:
        "Heated basalt stones are placed on key points of the body and used as massage tools. The warmth penetrates deeply, relaxing muscles three times faster than touch alone.",
      duration_minutes: 90,
      price_cents: 16500,
      buffer_after_minutes: 20,
      max_advance_days: 60,
      cancellation_cutoff_hours: 24,
      is_active: true,
      category: "massage",
      image_url:
        "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=800&h=600&fit=crop",
      created_at: nowIso(),
    },
    {
      id: "s-aromatherapy",
      provider_id: FIXED_IDS.marcus,
      name: "Aromatherapy Ritual",
      slug: "aromatherapy-ritual",
      description: "Custom essential oil blend chosen for your nervous system that day.",
      long_description:
        "Begins with a brief consultation to choose from our Essentially Yours blends. Lavender for sleep, rosemary for clarity, frankincense for grief — your therapist tailors the strokes to the chosen oil's energetic intent.",
      duration_minutes: 60,
      price_cents: 12000,
      buffer_after_minutes: 15,
      max_advance_days: 60,
      cancellation_cutoff_hours: 24,
      is_active: true,
      category: "wellness",
      image_url:
        "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800&h=600&fit=crop",
      created_at: nowIso(),
    },
    {
      id: "s-ceu-anatomy",
      provider_id: FIXED_IDS.adele,
      name: "CEU: Anatomy & Palpation Refresher",
      slug: "ceu-anatomy-palpation",
      description: "8-hour continuing education course for licensed massage therapists.",
      long_description:
        "Approved by the Delaware Board of Massage and Bodywork. Live in-person workshop covering surface anatomy, palpation skills, and updated documentation standards. Includes lunch and a printed reference manual.",
      duration_minutes: 480,
      price_cents: 32500,
      buffer_after_minutes: 0,
      max_advance_days: 120,
      cancellation_cutoff_hours: 72,
      is_active: true,
      category: "ceu",
      image_url:
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop",
      created_at: nowIso(),
    },
  ];
  store.services.push(...services);

  const providers = [
    FIXED_IDS.marcus,
    FIXED_IDS.jasmine,
    FIXED_IDS.rosa,
    FIXED_IDS.liam,
    FIXED_IDS.adele,
  ];
  const rules: AvailabilityRule[] = [];
  for (const pid of providers) {
    for (const day of [2, 3, 4, 5, 6]) {
      rules.push({
        id: generateId(),
        provider_id: pid,
        day_of_week: day,
        start_time: "09:00",
        end_time: "18:00",
        is_active: true,
      });
    }
  }
  store.availability_rules.push(...rules);

  const products: Product[] = [
    {
      id: "p-lavender-oil",
      slug: "lavender-essential-oil",
      name: "Lavender Essential Oil",
      description: "French-grown, steam-distilled. 15ml.",
      long_description:
        "Sourced from a single farm in Provence and bottled at our Middletown studio. Use 2–3 drops in a diffuser or dilute with carrier oil for skin application. Calming, grounding, sleep-supportive.",
      price_cents: 2400,
      compare_at_cents: null,
      category: "essential-oil",
      image_url:
        "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&h=800&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&h=800&fit=crop",
        "https://images.unsplash.com/photo-1591902863943-9d6c45c79bf2?w=800&h=800&fit=crop",
      ],
      stock: 24,
      variants: [
        { id: "v-15ml", name: "15ml", price_cents: 2400, sku: "EO-LAV-15", stock: 24 },
        { id: "v-30ml", name: "30ml", price_cents: 4200, sku: "EO-LAV-30", stock: 12 },
      ],
      is_active: true,
      created_at: nowIso(),
    },
    {
      id: "p-rest-balm",
      slug: "deep-rest-healing-balm",
      name: "Deep Rest Healing Balm",
      description: "Beeswax + arnica + magnesium. For knots and tired feet.",
      long_description:
        "Hand-poured in small batches. Massage into shoulders, lower back, or feet before bed. Contains arnica, magnesium chloride, beeswax, and a whisper of lavender + sweet marjoram.",
      price_cents: 3200,
      compare_at_cents: 3800,
      category: "balm",
      image_url:
        "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=800&fit=crop",
      gallery: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=800&fit=crop"],
      stock: 18,
      variants: [],
      is_active: true,
      created_at: nowIso(),
    },
    {
      id: "p-citrus-lotion",
      slug: "citrus-grove-body-lotion",
      name: "Citrus Grove Body Lotion",
      description: "Bergamot, sweet orange, and shea butter.",
      long_description:
        "Light, fast-absorbing. Bergamot lifts the mood while shea butter holds moisture. Ideal for after-shower or post-massage maintenance.",
      price_cents: 2800,
      compare_at_cents: null,
      category: "lotion",
      image_url:
        "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&h=800&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&h=800&fit=crop",
      ],
      stock: 30,
      variants: [],
      is_active: true,
      created_at: nowIso(),
    },
    {
      id: "p-eucalyptus-oil",
      slug: "eucalyptus-essential-oil",
      name: "Eucalyptus Essential Oil",
      description: "Clearing and bright. Excellent in steam.",
      long_description:
        "Australian-sourced eucalyptus radiata — gentler than globulus, well-suited to children's diffusers. Try 3 drops in a hot shower for instant clarity.",
      price_cents: 2200,
      compare_at_cents: null,
      category: "essential-oil",
      image_url:
        "https://images.unsplash.com/photo-1608181831718-c9ffd8728c4d?w=800&h=800&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1608181831718-c9ffd8728c4d?w=800&h=800&fit=crop",
      ],
      stock: 20,
      variants: [
        { id: "v-15ml-e", name: "15ml", price_cents: 2200, sku: "EO-EUC-15", stock: 20 },
        { id: "v-30ml-e", name: "30ml", price_cents: 3800, sku: "EO-EUC-30", stock: 8 },
      ],
      is_active: true,
      created_at: nowIso(),
    },
    {
      id: "p-sleep-candle",
      slug: "twilight-soy-candle",
      name: "Twilight Soy Candle",
      description: "Vetiver, cedarwood, vanilla. 8oz, 50hr burn.",
      long_description:
        "Hand-poured soy wax with a wood wick. The crackle of the wick paired with vetiver and warm vanilla makes this our most-gifted product.",
      price_cents: 3400,
      compare_at_cents: null,
      category: "candle",
      image_url:
        "https://images.unsplash.com/photo-1602874801007-aa8c8b5beecf?w=800&h=800&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1602874801007-aa8c8b5beecf?w=800&h=800&fit=crop",
      ],
      stock: 15,
      variants: [],
      is_active: true,
      created_at: nowIso(),
    },
    {
      id: "p-gift-trio",
      slug: "essentially-yours-gift-trio",
      name: "Essentially Yours Gift Trio",
      description: "Lavender oil, Deep Rest balm, and Twilight candle in a kraft box.",
      long_description:
        "Our most popular gift. Three of our bestsellers in a recyclable kraft gift box, hand-tied with linen ribbon. Optional handwritten card available at checkout.",
      price_cents: 7800,
      compare_at_cents: 9000,
      category: "gift-set",
      image_url:
        "https://images.unsplash.com/photo-1607006344380-b6775a0824a7?w=800&h=800&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1607006344380-b6775a0824a7?w=800&h=800&fit=crop",
      ],
      stock: 10,
      variants: [],
      is_active: true,
      created_at: nowIso(),
    },
  ];
  store.products.push(...products);

  const past = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  const future = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  future.setHours(10, 0, 0, 0);
  const futureEnd = new Date(future.getTime() + 60 * 60 * 1000);
  past.setHours(14, 0, 0, 0);
  const pastEnd = new Date(past.getTime() + 60 * 60 * 1000);

  const bookings: Booking[] = [
    {
      id: generateId(),
      user_id: FIXED_IDS.demoUser,
      provider_id: FIXED_IDS.marcus,
      service_id: "s-swedish",
      start_at: future.toISOString(),
      end_at: futureEnd.toISOString(),
      status: "confirmed",
      notes: "First-time client — please use lighter pressure on shoulders.",
      price_cents: 11500,
      stripe_payment_intent_id: "pi_mock_demo_upcoming",
      cancellation_reason: null,
      refund_status: "none",
      created_at: nowIso(),
      updated_at: nowIso(),
    },
    {
      id: generateId(),
      user_id: FIXED_IDS.demoUser,
      provider_id: FIXED_IDS.rosa,
      service_id: "s-hot-stone",
      start_at: past.toISOString(),
      end_at: pastEnd.toISOString(),
      status: "completed",
      notes: "",
      price_cents: 16500,
      stripe_payment_intent_id: "pi_mock_demo_past",
      cancellation_reason: null,
      refund_status: "none",
      created_at: past.toISOString(),
      updated_at: past.toISOString(),
    },
  ];
  store.bookings.push(...bookings);

  store.notifications.push({
    id: generateId(),
    user_id: FIXED_IDS.demoUser,
    type: "booking_confirmed",
    title: "Your Swedish Massage is confirmed",
    body: `With Marcus on ${future.toLocaleDateString()} at 10:00 AM.`,
    action_url: "/dashboard/bookings",
    image_url: null,
    data: {},
    is_read: false,
    read_at: null,
    is_dismissed: false,
    created_at: nowIso(),
  });
  store.notifications.push({
    id: generateId(),
    user_id: FIXED_IDS.demoUser,
    type: "system_alert",
    title: "Welcome to Healing Hands Spa",
    body: "Your account is ready. Sign in with demo@healinghandsspa.com / spa-demo-2026.",
    action_url: "/dashboard",
    image_url: null,
    data: {},
    is_read: false,
    read_at: null,
    is_dismissed: false,
    created_at: nowIso(),
  });
}
