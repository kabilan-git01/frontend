-- 1. Create tables
CREATE TABLE IF NOT EXISTS public.programs (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT,
    slug TEXT,
    icon TEXT,
    "shortDesc" TEXT,
    description TEXT,
    image TEXT,
    highlights JSONB,
    duration TEXT,
    level TEXT,
    price INTEGER
);

CREATE TABLE IF NOT EXISTS public.plans (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT,
    slug TEXT,
    description TEXT,
    features JSONB,
    pricing JSONB,
    popular BOOLEAN
);

CREATE TABLE IF NOT EXISTS public.trainers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT,
    slug TEXT,
    specialty TEXT,
    bio TEXT,
    "shortBio" TEXT,
    image TEXT,
    certs JSONB,
    experience TEXT,
    rating NUMERIC(3,2),
    "sessionsCompleted" INTEGER,
    programs JSONB,
    socials JSONB,
    availability JSONB,
    "sessionPrice" INTEGER
);

CREATE TABLE IF NOT EXISTS public.testimonials (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT,
    avatar TEXT,
    rating NUMERIC(3,2),
    quote TEXT,
    featured BOOLEAN,
    type TEXT,
    "beforeAfter" JSONB
);

CREATE TABLE IF NOT EXISTS public.gallery_images (
    id TEXT PRIMARY KEY,
    src TEXT NOT NULL,
    alt TEXT
);

CREATE TABLE IF NOT EXISTS public.enquiries (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT,
    date TEXT,
    status TEXT
);

CREATE TABLE IF NOT EXISTS public.members (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    plan TEXT,
    "joinDate" TEXT,
    status TEXT
);

-- Enable RLS & Row level access rules if needed, or allow read/write for anon role
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON public.programs FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.plans FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.trainers FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.gallery_images FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.enquiries FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.members FOR SELECT USING (true);

CREATE POLICY "Allow public inserts" ON public.enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public inserts" ON public.members FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public inserts" ON public.testimonials FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin updates/deletes" ON public.plans FOR ALL USING (true);
CREATE POLICY "Allow admin updates/deletes" ON public.trainers FOR ALL USING (true);
CREATE POLICY "Allow admin updates/deletes" ON public.enquiries FOR ALL USING (true);
CREATE POLICY "Allow admin updates/deletes" ON public.members FOR ALL USING (true);
CREATE POLICY "Allow admin updates/deletes" ON public.testimonials FOR ALL USING (true);

-- 2. Seed default data
INSERT INTO public.programs (id, name, category, slug, icon, "shortDesc", description, image, highlights, duration, level, price) VALUES
('strength-training', 'Strength Training', 'programs', 'strength-training', 'fa-dumbbell', 'Build muscle, boost physical endurance, and improve biomechanics with professional barbell workouts.', 'Our Strength and Conditioning program focuses on compound barbell lifts, Olympic weightlifting structures, and structural hypertrophy blocks. Engineered to build absolute physical power, increase bone density, and fortify joints against injury.', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop', '["Powerlifting Foundations", "Hypertrophy & Density", "Postural Biomechanics", "Olympic Lifting Techniques"]'::jsonb, '8-12 weeks', 'All Levels', 149),
('cardio', 'Cardio & Endurance', 'programs', 'cardio', 'fa-heart-pulse', 'Maximize VO2 max and burn calories with modern treadmill arrays and high-intensity running blocks.', 'Maximize your VO2 max, elevate baseline cardiovascular operational capacity, and torch calories. Our Cardio sessions utilize high-tech treadmill interfaces, air bikes, rowing arrays, and timed athletic sprints.', 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800&auto=format&fit=crop', '["High-intensity HIIT Blocks", "VO2 Max Optimizations", "Aerobic Capacity Drills", "Heart Rate Zone Tracking"]'::jsonb, '6-8 weeks', 'Beginner to Advanced', 99),
('crossfit', 'CrossFit', 'programs', 'crossfit', 'fa-fire', 'High-octane program blending plyometrics, Olympic weightlifting, and gymnastics.', 'A high-octane program blending plyometrics, olympic weightlifting, and gymnastics to maximize physical work capacity. Build functional strength and mental toughness in a community-driven environment.', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop', '["WOD Programming", "Olympic Lifting", "Gymnastics Skills", "Competition Prep"]'::jsonb, 'Ongoing', 'Intermediate to Advanced', 179),
('weight-loss', 'Weight Loss', 'programs', 'weight-loss', 'fa-weight-scale', 'Scientifically designed fat loss blocks combining resistance training and metabolic conditioning.', 'Scientifically designed fat loss blocks combining resistance training, metabolic conditioning, and nutritional accountability. Transform your body composition with proven methodologies.', 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop', '["Metabolic Conditioning", "Nutrition Coaching", "Body Composition Tracking", "Accountability Check-ins"]'::jsonb, '12 weeks', 'All Levels', 199),
('personal-training', 'Personal Training', 'programs', 'personal-training', 'fa-user-shield', 'Elite 1-on-1 coaching tailored to your specific goals, schedule, and biomechanics.', 'Elite 1-on-1 coaching tailored to your specific goals, schedule, and biomechanics. Work directly with certified specialists who design every session around your unique needs.', 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=800&auto=format&fit=crop', '["Custom Programming", "Form Correction", "Goal-Specific Plans", "Flexible Scheduling"]'::jsonb, 'Flexible', 'All Levels', 299)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.plans (id, name, category, slug, description, features, pricing, popular) VALUES
('basic', 'Basic Plan', 'plans', 'basic', 'Essential gym access for fitness enthusiasts starting their journey.', '[{"text": "Access to Gym Floor & Cardio", "included": true}, {"text": "Standard Lockers & Showers", "included": true}, {"text": "1 Free Physical Evaluation", "included": true}, {"text": "Access to Group Classes", "included": false}, {"text": "1-on-1 Personal Trainer", "included": false}, {"text": "Free Customized Nutrition Plan", "included": false}]'::jsonb, '{"monthly": 29, "quarterly": 79, "yearly": 278}'::jsonb, false),
('elite', 'Elite Plan', 'plans', 'elite', 'Our most popular plan with full facility access and coaching sessions.', '[{"text": "Unlimited Gym & Cardio Access", "included": true}, {"text": "VIP Lockers & Sauna Access", "included": true}, {"text": "Monthly Physical Evaluations", "included": true}, {"text": "Full Access to Group Classes", "included": true}, {"text": "2 Personal Coaching Sessions/mo", "included": true}, {"text": "Free Customized Nutrition Plan", "included": false}]'::jsonb, '{"monthly": 59, "quarterly": 159, "yearly": 566}'::jsonb, true),
('vip', 'VIP Plan', 'plans', 'vip', 'Ultimate premium experience with unlimited coaching and 24/7 access.', '[{"text": "24/7 Full Facility Access", "included": true}, {"text": "Private VIP Lounge & Sauna", "included": true}, {"text": "Weekly Physical Evaluations", "included": true}, {"text": "Unlimited Group Classes", "included": true}, {"text": "8 Personal Coaching Sessions/mo", "included": true}, {"text": "Free Customized Nutrition Plan", "included": true}]'::jsonb, '{"monthly": 99, "quarterly": 269, "yearly": 950}'::jsonb, false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.trainers (id, name, category, slug, specialty, bio, "shortBio", image, certs, experience, rating, "sessionsCompleted", programs, socials, availability, "sessionPrice") VALUES
('marcus-vance', 'Marcus Vance', 'trainers', 'marcus-vance', 'Strength & Conditioning Coach', 'Marcus specializes in linear progressive loading and powerlifting. He has trained over 50 competitive strength athletes and holds multiple world-class certifications.', 'Marcus specializes in linear progressive loading and powerlifting. He has trained over 50 competitive strength athletes.', 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=600&auto=format&fit=crop', '["CSCS", "NASM-PES", "10+ YRS EXP"]'::jsonb, '12 years', 4.9, 3200, '["strength-training", "crossfit"]'::jsonb, '{"facebook": "#", "twitter": "#", "instagram": "#"}'::jsonb, '["Mon 9AM-5PM", "Wed 9AM-5PM", "Fri 9AM-3PM"]'::jsonb, 85),
('sarah-jenkins', 'Sarah Jenkins', 'trainers', 'sarah-jenkins', 'Cardio Specialist', 'Sarah is a former marathon athlete turned elite endurance coach. She designs heart-rate optimized programs for fat loss and cardiovascular health.', 'Sarah is a former marathon athlete turned elite endurance coach specializing in cardiovascular optimization.', 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?q=80&w=600&auto=format&fit=crop', '["ACE-CPT", "HIIT Certified", "8+ YRS EXP"]'::jsonb, '8 years', 4.8, 2100, '["cardio", "weight-loss"]'::jsonb, '{"facebook": "#", "twitter": "#", "instagram": "#"}'::jsonb, '["Tue 7AM-3PM", "Thu 7AM-3PM", "Sat 8AM-12PM"]'::jsonb, 75),
('david-chen', 'David Chen', 'trainers', 'david-chen', 'CrossFit Level 3 Coach', 'David competed nationally in CrossFit and now coaches athletes of all levels. His programming emphasizes movement quality and progressive overload.', 'David competed nationally in CrossFit and coaches athletes of all levels with focus on movement quality.', 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=600&auto=format&fit=crop', '["CF-L3", "USAW-L1", "6+ YRS EXP"]'::jsonb, '6 years', 4.9, 1800, '["crossfit", "strength-training"]'::jsonb, '{"facebook": "#", "twitter": "#", "instagram": "#"}'::jsonb, '["Mon 6AM-2PM", "Wed 6AM-2PM", "Fri 6AM-2PM"]'::jsonb, 90),
('elena-rodriguez', 'Elena Rodriguez', 'trainers', 'elena-rodriguez', 'Weight Loss & Nutrition Coach', 'Elena combines exercise science with nutritional coaching to deliver sustainable body transformation results for her clients.', 'Elena combines exercise science with nutritional coaching for sustainable body transformation.', 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=600&auto=format&fit=crop', '["PN-L1", "NASM-CPT", "7+ YRS EXP"]'::jsonb, '7 years', 4.7, 1500, '["weight-loss", "personal-training"]'::jsonb, '{"facebook": "#", "twitter": "#", "instagram": "#"}'::jsonb, '["Tue 10AM-6PM", "Thu 10AM-6PM", "Sat 9AM-1PM"]'::jsonb, 80),
('james-wright', 'James Wright', 'trainers', 'james-wright', 'Personal Training Specialist', 'James provides elite 1-on-1 coaching for executives and athletes. His holistic approach covers training, recovery, and lifestyle optimization.', 'James provides elite 1-on-1 coaching with a holistic approach to training, recovery, and lifestyle.', 'https://images.unsplash.com/photo-1634449577700-2d53f1f5c9e1?q=80&w=600&auto=format&fit=crop', '["NASM-CPT", "FMS", "15+ YRS EXP"]'::jsonb, '15 years', 5.0, 4500, '["personal-training", "strength-training"]'::jsonb, '{"facebook": "#", "twitter": "#", "instagram": "#"}'::jsonb, '["Mon-Fri 6AM-8PM"]'::jsonb, 120),
('maya-patel', 'Maya Patel', 'trainers', 'maya-patel', 'Functional Fitness Coach', 'Maya focuses on functional movement patterns and injury prevention. Perfect for beginners and those returning to fitness after injury.', 'Maya focuses on functional movement patterns and injury prevention for all fitness levels.', 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600&auto=format&fit=crop', '["ACSM-CPT", "Corrective Exercise", "5+ YRS EXP"]'::jsonb, '5 years', 4.8, 900, '["personal-training", "cardio"]'::jsonb, '{"facebook": "#", "twitter": "#", "instagram": "#"}'::jsonb, '["Mon 11AM-7PM", "Wed 11AM-7PM", "Sun 10AM-2PM"]'::jsonb, 70)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.testimonials (id, name, role, avatar, rating, quote, featured, type, "beforeAfter") VALUES
('test-1', 'Dave Miller', 'Member for 2 Years', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop', 5.0, 'Titan Fitness Gym completely changed my perception of training. The premium dark atmosphere puts you in the zone immediately. The trainers are incredibly knowledgeable and actually push you to your limits.', true, 'testimonial', NULL),
('test-2', 'Jessica Sterling', 'Member for 1 Year', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop', 5.0, 'The facilities here are top-tier. Extremely clean locker rooms, dynamic equipment ranges, and an elite coaching staff. I joined the Elite Plan and the 1-on-1 sessions helped me break my deadlift plateau!', true, 'testimonial', NULL),
('test-3', 'Ryan Reynolds', 'Member for 6 Months', 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=150&auto=format&fit=crop', 4.5, 'The CrossFit courses are brutal but incredibly satisfying. Excellent camaraderie within the classes, and the trainers correct your lifting posture meticulously. Best gym membership investment in town.', true, 'testimonial', NULL),
('story-1', 'Michael Torres', 'Lost 45 lbs in 6 months', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop', 5.0, 'Started at 245 lbs, now at 200. Elena''s weight loss program and the Titan community kept me accountable every single day. Life-changing transformation.', true, 'success-story', '{"before": "245 lbs", "after": "200 lbs"}'::jsonb),
('story-2', 'Amanda Chen', 'Competition Ready in 12 weeks', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop', 5.0, 'David''s CrossFit programming took me from casual athlete to regional competition qualifier. The coaching at Titan is world-class.', true, 'success-story', '{"before": "Beginner", "after": "Regional Qualifier"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.gallery_images (id, src, alt) VALUES
('g1', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop', 'Gym floor equipment'),
('g2', 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=600&auto=format&fit=crop', 'Personal training session'),
('g3', 'https://images.unsplash.com/photo-1540497077202-7a8a3998166e?q=80&w=600&auto=format&fit=crop', 'Weight room'),
('g4', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop', 'Strength training area'),
('g5', 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=600&auto=format&fit=crop', 'Cardio zone'),
('g6', 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=600&auto=format&fit=crop', 'Group fitness class')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.members (id, name, email, plan, "joinDate", status) VALUES
('m1', 'Dave Miller', 'dave@email.com', 'Elite Plan', '2024-01-15', 'active'),
('m2', 'Jessica Sterling', 'jessica@email.com', 'VIP Plan', '2024-06-20', 'active'),
('m3', 'Ryan Reynolds', 'ryan@email.com', 'Basic Plan', '2025-08-01', 'active')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.enquiries (id, name, email, subject, message, date, status) VALUES
('e1', 'John Smith', 'john@email.com', 'Elite Plan Inquiry', 'Interested in the Elite membership plan.', '2026-06-15', 'new'),
('e2', 'Lisa Wong', 'lisa@email.com', 'Personal Training', 'Looking for 1-on-1 sessions with James Wright.', '2026-06-18', 'read')
ON CONFLICT (id) DO NOTHING;

-- 3. Create tables for previously hardcoded sections
CREATE TABLE IF NOT EXISTS public.home_features (
    id TEXT PRIMARY KEY,
    icon TEXT,
    title TEXT NOT NULL,
    "desc" TEXT
);

CREATE TABLE IF NOT EXISTS public.about_story (
    id TEXT PRIMARY KEY,
    subtitle TEXT,
    title TEXT NOT NULL,
    image TEXT,
    paragraphs JSONB
);

CREATE TABLE IF NOT EXISTS public.about_stats (
    id TEXT PRIMARY KEY,
    num TEXT NOT NULL,
    label TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.contact_info (
    id TEXT PRIMARY KEY,
    icon TEXT,
    title TEXT NOT NULL,
    text TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.gym_hours (
    id TEXT PRIMARY KEY,
    day TEXT NOT NULL,
    time TEXT NOT NULL,
    "isRed" BOOLEAN DEFAULT false
);

-- Enable RLS for new tables
ALTER TABLE public.home_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_story ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gym_hours ENABLE ROW LEVEL SECURITY;

-- Allow public read access policies
CREATE POLICY "Allow public read access" ON public.home_features FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.about_story FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.about_stats FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.contact_info FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.gym_hours FOR SELECT USING (true);

-- Seed values for new tables
INSERT INTO public.home_features (id, icon, title, "desc") VALUES
('feat-1', 'fa-dumbbell', 'Elite Equipment', 'Industry-leading hammer strength plate loaders, competition-grade barbells, and customized squat cells.'),
('feat-2', 'fa-user-shield', 'Expert Coaching', 'Fully certified trainers with specialty designations in corrective biomechanics and sports nutrition.'),
('feat-3', 'fa-clock', '24/7 Facility Access', 'Keycard entry system provides Elite and VIP members with full-facility access around the clock.'),
('feat-4', 'fa-apple-whole', 'Diet Strategies', 'Direct nutritional support, custom macros allocations, and daily accountability checks.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.about_story (id, subtitle, title, image, paragraphs) VALUES
('story-main', 'Since 2015', 'Built On Grit & Performance', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop', '[
  "Titan Fitness Gym was founded with a singular vision: create a training environment where serious athletes and everyday warriors alike could push beyond their perceived limits in a premium, high-intensity atmosphere.",
  "Our 15,000 sq ft facility houses competition-grade equipment, dedicated CrossFit zones, private coaching suites, and recovery amenities including saunas and cold plunge pools.",
  "With over 10,000 members transformed and a team of 20+ certified coaches, Titan has become the benchmark for premium fitness in the region."
]'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.about_stats (id, num, label) VALUES
('stat-1', '10K+', 'Members Transformed'),
('stat-2', '20+', 'Expert Coaches'),
('stat-3', '15K', 'Sq Ft Facility'),
('stat-4', '24/7', 'VIP Access')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.contact_info (id, icon, title, text) VALUES
('contact-1', 'fa-location-dot', 'Location', '123 Iron Street, San Francisco, CA 94102'),
('contact-2', 'fa-phone', 'Phone', '+1 (555) 123-4567'),
('contact-3', 'fa-envelope', 'Email', 'info@titanfitness.com'),
('contact-4', 'fa-clock', 'Hours', 'Mon-Fri: 5AM-11PM | Sat-Sun: 6AM-9PM')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.gym_hours (id, day, time, "isRed") VALUES
('hour-1', 'Mon - Fri', '05:00 - 23:00', false),
('hour-2', 'Saturday', '06:00 - 21:00', false),
('hour-3', 'Sunday', '08:00 - 18:00', false),
('hour-4', 'Sauna Access', '24 Hours', true)
ON CONFLICT (id) DO NOTHING;

