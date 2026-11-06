/**
 * Seed script — creates a default admin user and sample news articles.
 * Run with: npm run seed
 */
import { connectDB } from "../config/db.js";
import { env } from "../config/env.js";
import User from "../models/User.js";
import News from "../models/News.js";

async function seed() {
  await connectDB();

  // Create admin user
  const adminEmail = "admin@bridgeinitiative.org";
  const existing = await User.findOne({ email: adminEmail });
  if (!existing) {
    await User.create({
      name: "Bridge Admin",
      email: adminEmail,
      password: "ChangeMe123!",
      role: "admin",
    });
    console.log("✓ Admin user created:");
    console.log(`  Email: ${adminEmail}`);
    console.log(`  Password: ChangeMe123!`);
    console.log("  ⚠ Change this password immediately after first login.");
  } else {
    console.log("• Admin user already exists, skipping.");
  }

  // Create sample news articles
  const newsCount = await News.countDocuments();
  if (newsCount === 0) {
    await News.create([
      {
        title: "Digital for Impact 1.0 is coming on 28 November 2026",
        excerpt: "The Bridge Initiative's first major conference will explore AI, blockchain and meaningful change.",
        content: "Join us at RCN Tent, Awka for a day of ideas and dialogue about how emerging technologies can serve people and communities.",
        category: "announcement",
        published: true,
        publishedAt: new Date(),
        author: "The Bridge Initiative",
      },
      {
        title: "The Bridge Initiative Unveils StackForge: Building the Next Generation of Industry-Ready Developers",
        excerpt: "The Bridge Initiative introduces StackForge, a project-driven engineering ecosystem designed to bridge the gap between learning software development and gaining real-world professional experience.",
        content: `The Bridge Initiative is excited to introduce StackForge, a project-driven engineering ecosystem designed to bridge the gap between learning software development and gaining real-world professional experience.

Across Africa's growing technology ecosystem, many emerging developers possess technical knowledge but lack the practical experience, collaborative exposure, and structured opportunities required to demonstrate their capabilities.

StackForge exists to address this challenge.

Rather than functioning as another coding school or passive developer community, StackForge provides a structured environment where developers work in teams, build functional products, solve practical problems, participate in code reviews, and deliver projects within defined timelines.

**What makes StackForge different?**

- Real-world projects: Developers work on practical products and meaningful problem statements.
- Collaborative engineering: Members work in structured teams with defined responsibilities.
- Accountability: Milestones, deadlines, deliverables, and code reviews drive progress.
- Portfolio development: Members build verifiable projects that demonstrate their capabilities.
- Industry exposure: The ecosystem creates pathways for developers to connect with businesses and opportunities.

StackForge is designed for emerging developers, including self-taught developers, bootcamp graduates, and individuals seeking practical experience and meaningful collaboration.

Our philosophy is simple: Build. Review. Ship. Prove.

Through StackForge, The Bridge Initiative seeks to nurture competent developers who can move beyond knowing how to code to building solutions that matter.

Ready to build something meaningful? Join StackForge.`,
        category: "announcement",
        published: true,
        publishedAt: new Date(),
        author: "The Bridge Initiative",
      },
      {
        title: "Introducing The Bridge Conversations: Creating Space for Conversations That Matter",
        excerpt: "The Bridge Initiative introduces The Bridge Conversations, a platform designed to create meaningful spaces for young people to engage in honest, thoughtful, and transformative conversations about the issues that shape their lives.",
        content: `The Bridge Initiative is pleased to introduce The Bridge Conversations, a platform designed to create meaningful spaces for young people to engage in honest, thoughtful, and transformative conversations about the issues that shape their lives.

Growing up comes with questions, decisions, expectations, pressures, and experiences that are not always easy to navigate. Beyond academic achievements and professional development, young people need spaces where they can explore who they are, understand their values, build healthy relationships, strengthen their faith, and discover their purpose.

The Bridge Conversations seeks to provide that space.

Through interactive discussions, heart-to-heart conversations, question-and-answer sessions, mentorship, and guided engagements, the platform encourages participants to express themselves, learn from others, ask important questions, and develop a deeper understanding of life.

**What will we talk about?**

- Identity: Understanding who you are and developing a healthy sense of self.
- Faith: Exploring faith, spirituality, and their relevance to everyday life.
- Relationships: Navigating friendships, family, love, boundaries, and social connections.
- Purpose: Discovering personal direction, gifts, and meaningful contributions.
- Values: Developing character, principles, and responsible decision-making.
- Personal Development: Growing emotionally, intellectually, socially, and spiritually.

The Bridge Conversations is more than a discussion platform. It is an opportunity to listen, learn, reflect, ask questions, and grow together.

We believe that meaningful conversations can inspire meaningful change.

Your voice matters. Your questions matter. Your growth matters.

Welcome to The Bridge Conversations.`,
        category: "announcement",
        published: true,
        publishedAt: new Date(),
        author: "The Bridge Initiative",
      },
    ]);
    console.log("✓ Sample news articles created.");
  } else {
    console.log(`• ${newsCount} news articles already exist, skipping seed.`);
  }

  console.log("\n✅ Seed complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
