const db = require("../database/connect");

const INTEREST_SYNONYMS = {
  Running: [
    "run",
    "runs",
    "running",
    "runner",
    "runners",
    "jog",
    "jogs",
    "jogging",
    "jogger",
    "joggers",
    "sprint",
    "sprinting",
    "race",
    "racing",
    "5k",
    "10k",
    "marathon",
    "half marathon",
    "park run",
    "parkrun",
    "fun run",
    "road run",
    "road running",
    "trail run",
    "trail running",
    "company run",
    "running club",
    "run club",
    "group run",
    "fitness run",
    "charity run",
  ],

  Film: [
    "film",
    "films",
    "movie",
    "movies",
    "cinema",
    "screening",
    "screenings",
    "movie night",
    "film night",
    "watch party",
    "movie club",
    "film club",
    "documentary",
    "documentaries",
    "feature film",
    "indie film",
    "cinema night",
    "movie evening",
    "film evening",
  ],

  Gaming: [
    "game",
    "games",
    "gaming",
    "gamer",
    "gamers",
    "video game",
    "video games",
    "pc game",
    "pc games",
    "console game",
    "console games",
    "multiplayer",
    "online gaming",
    "esports",
    "e-sports",
    "xbox",
    "playstation",
    "nintendo",
    "switch",
    "co-op",
    "coop",
    "lan party",
    "tournament",
    "gaming night",
    "game night",
  ],

  Cooking: [
    "cook",
    "cooks",
    "cooking",
    "cooked",
    "kitchen",
    "chef",
    "chefs",
    "bake",
    "bakes",
    "baking",
    "meal prep",
    "recipe",
    "recipes",
    "food",
    "foodie",
    "foodies",
    "cookery",
    "culinary",
    "cook off",
    "cook-off",
    "bake off",
    "bake-off",
    "dinner making",
    "lunch making",
  ],

  "Board games": [
    "board game",
    "board games",
    "tabletop",
    "table top",
    "tabletop game",
    "tabletop games",
    "card game",
    "card games",
    "strategy game",
    "strategy games",
    "party game",
    "party games",
    "tabletop night",
    "board game night",
    "boardgaming",
    "board gamer",
    "board gamers",
    "table game",
    "table games",
  ],

  Hiking: [
    "hike",
    "hikes",
    "hiking",
    "walker",
    "walkers",
    "walk",
    "walks",
    "walking",
    "trail",
    "trails",
    "ramble",
    "rambles",
    "rambling",
    "trek",
    "treks",
    "trekking",
    "nature walk",
    "hill walk",
    "hillwalking",
    "outdoor walk",
    "group walk",
    "countryside walk",
  ],

  Photography: [
    "photography",
    "photograph",
    "photographs",
    "photographer",
    "photographers",
    "photo",
    "photos",
    "camera",
    "cameras",
    "photo walk",
    "photo trip",
    "photo shoot",
    "photoshoot",
    "picture",
    "pictures",
    "snapshot",
    "snapshots",
    "street photography",
    "portrait photography",
    "landscape photography",
  ],

  Reading: [
    "read",
    "reads",
    "reading",
    "reader",
    "readers",
    "book",
    "books",
    "book club",
    "bookgroup",
    "book group",
    "novel",
    "novels",
    "literature",
    "literary",
    "fiction",
    "non-fiction",
    "poetry",
    "reading club",
    "reading group",
    "book discussion",
  ],

  Yoga: [
    "yoga",
    "stretch",
    "stretches",
    "stretching",
    "flow",
    "yoga flow",
    "vinyasa",
    "hatha",
    "yin yoga",
    "mindfulness movement",
    "meditative movement",
    "wellness stretch",
    "breathing session",
    "breathwork",
    "mobility",
    "mobility session",
  ],

  Cycling: [
    "cycle",
    "cycles",
    "cycling",
    "cyclist",
    "cyclists",
    "bike",
    "bikes",
    "biking",
    "biker",
    "bikers",
    "ride",
    "rides",
    "riding",
    "bike ride",
    "group ride",
    "cycle ride",
    "spin",
    "spinning",
    "road cycling",
    "commuter ride",
    "pedal",
    "pedalling",
  ],

  Music: [
    "music",
    "song",
    "songs",
    "playlist",
    "playlists",
    "concert",
    "concerts",
    "gig",
    "gigs",
    "sing",
    "sings",
    "singing",
    "choir",
    "band",
    "bands",
    "jam",
    "jam session",
    "karaoke",
    "live music",
    "music night",
    "open mic",
    "open-mic",
    "dj",
    "dj set",
  ],

  Travel: [
    "travel",
    "travelling",
    "traveling",
    "traveller",
    "traveler",
    "travellers",
    "travelers",
    "trip",
    "trips",
    "holiday",
    "holidays",
    "vacation",
    "vacations",
    "journey",
    "journeys",
    "tour",
    "tours",
    "backpacking",
    "city break",
    "weekend away",
    "adventure travel",
    "travel talk",
    "travel meetup",
  ],

  Chess: [
    "chess",
    "chess club",
    "chess game",
    "chess games",
    "checkmate",
    "opening",
    "openings",
    "strategy board game",
    "chess night",
    "blitz chess",
    "rapid chess",
    "tournament chess",
  ],

  Volunteering: [
    "volunteer",
    "volunteers",
    "volunteering",
    "charity",
    "charities",
    "community",
    "community help",
    "community work",
    "giving back",
    "fundraising",
    "fundraiser",
    "fundraisers",
    "food bank",
    "soup kitchen",
    "mentor",
    "mentoring",
    "support work",
    "helping out",
    "social impact",
    "community project",
    "charity event",
  ],
};

function normaliseText(text = "") {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokeniseText(text = "") {
  return normaliseText(text)
    .split(" ")
    .map((token) => token.trim())
    .filter(Boolean);
}

function getWordVariants(word = "") {
  const cleaned = normaliseText(word);
  const variants = new Set([cleaned]);

  if (!cleaned) return [];

  if (cleaned.endsWith("ing")) {
    const stem = cleaned.slice(0, -3);
    variants.add(stem);
    variants.add(stem + "e");
    variants.add(stem.replace(/(.)\1$/, "$1"));
  }

  if (cleaned.endsWith("er")) {
    variants.add(cleaned.slice(0, -2));
  }

  if (cleaned.endsWith("ers")) {
    variants.add(cleaned.slice(0, -3));
  }

  if (cleaned.endsWith("ed")) {
    variants.add(cleaned.slice(0, -2));
    variants.add(cleaned.slice(0, -1));
  }

  if (cleaned.endsWith("s")) {
    variants.add(cleaned.slice(0, -1));
  }

  return [...variants].filter(Boolean);
}

function containsPhrase(text, phrase) {
  const normalizedText = ` ${normaliseText(text)} `;
  const normalizedPhrase = ` ${normaliseText(phrase)} `;
  return normalizedText.includes(normalizedPhrase);
}

function scoreInterestAgainstIdea(ideaText, interestName) {
  const cleanIdea = normaliseText(ideaText);
  const cleanInterest = normaliseText(interestName);

  if (!cleanIdea || !cleanInterest) {
    return { score: 0, reason: "none" };
  }

  if (containsPhrase(cleanIdea, cleanInterest)) {
    return { score: 100, reason: "direct interest match" };
  }

  const synonyms = INTEREST_SYNONYMS[interestName] || [];

  for (const synonym of synonyms) {
    if (containsPhrase(cleanIdea, synonym)) {
      return { score: 100, reason: `synonym match: ${synonym}` };
    }
  }

  const ideaWords = tokeniseText(cleanIdea).flatMap(getWordVariants);
  const interestWords = tokeniseText(cleanInterest).flatMap(getWordVariants);

  for (const ideaWord of ideaWords) {
    for (const interestWord of interestWords) {
      if (ideaWord && interestWord && ideaWord === interestWord) {
        return { score: 95, reason: "word root match" };
      }
    }
  }

  for (const synonym of synonyms) {
    const synonymWords = tokeniseText(synonym).flatMap(getWordVariants);

    for (const ideaWord of ideaWords) {
      for (const synonymWord of synonymWords) {
        if (!ideaWord || !synonymWord) continue;

        if (ideaWord === synonymWord) {
          return { score: 95, reason: `synonym root match: ${synonym}` };
        }

        if (
          ideaWord.length >= 4 &&
          synonymWord.length >= 4 &&
          (ideaWord.includes(synonymWord) || synonymWord.includes(ideaWord))
        ) {
          return { score: 85, reason: `partial synonym match: ${synonym}` };
        }
      }
    }
  }

  for (const ideaWord of ideaWords) {
    for (const interestWord of interestWords) {
      if (
        ideaWord.length >= 4 &&
        interestWord.length >= 4 &&
        (ideaWord.includes(interestWord) || interestWord.includes(ideaWord))
      ) {
        return { score: 80, reason: "partial word match" };
      }
    }
  }

  return { score: 0, reason: "none" };
}

class Event {
  constructor(data) {
    this.title = data.title;
    this.description = data.description;
    this.event_date = data.event_date;
    this.location = data.location || "TBD";
    this.category_name =
      data.category_name || data.primary_category_name || null;
    this.user_email = data.user_email || null;
    this.categories = Array.isArray(data.categories) ? data.categories : [];
  }

  async save() {
    const client = await db.connect();

    try {
      await client.query("BEGIN");

      const eventResult = await client.query(
        `
        INSERT INTO events (title, description, category_name, location, event_date)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
        `,
        [
          this.title,
          this.description,
          this.category_name,
          this.location,
          this.event_date,
        ]
      );

      const newEvent = eventResult.rows[0];

      const uniqueCategories = [
        ...new Set(
          [this.category_name, ...this.categories]
            .map((category) =>
              typeof category === "string" ? category.trim() : ""
            )
            .filter(Boolean)
        ),
      ];

      for (const category of uniqueCategories) {
        await client.query(
          `
          INSERT INTO event_categories (event_id, category_name)
          VALUES ($1, $2)
          ON CONFLICT (event_id, category_name) DO NOTHING;
          `,
          [newEvent.id, category]
        );
      }

      if (this.user_email) {
        await client.query(
          `
          INSERT INTO event_registrations (user_email, event_id, status)
          VALUES ($1, $2, $3)
          ON CONFLICT (user_email, event_id) DO NOTHING;
          `,
          [this.user_email, newEvent.id, "registered"]
        );

        await client.query(
          `
          INSERT INTO event_registrations (user_email, event_id, status)
          SELECT ui.user_email, $1, 'unresponsive'
          FROM user_interests ui
          WHERE LOWER(TRIM(ui.interest_name)) = LOWER(TRIM($2))
            AND ui.user_email != $3
          ON CONFLICT (user_email, event_id) DO NOTHING;
          `,
          [newEvent.id, this.category_name, this.user_email]
        );
      }

      await client.query("COMMIT");
      return newEvent;
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("Error saving event:", err);
      throw err;
    } finally {
      client.release();
    }
  }

  static async getAllEvents() {
    const result = await db.query(`
    SELECT
      e.*,
      TO_CHAR(e.event_date, 'DD/MM/YYYY') AS event_date,
      COALESCE(
        ARRAY_AGG(ec.category_name ORDER BY ec.category_name)
        FILTER (WHERE ec.category_name IS NOT NULL),
        ARRAY[]::TEXT[]
      ) AS categories
    FROM events e
    LEFT JOIN event_categories ec
      ON e.id = ec.event_id
    GROUP BY e.id
    ORDER BY e.event_date ASC, e.created_at DESC, e.id ASC;
  `);

    return result.rows;
  }

  static async updateById(id, data) {
    const client = await db.connect();

    try {
      await client.query("BEGIN");

      const existingEventResult = await client.query(
        `
        SELECT *
        FROM events
        WHERE id = $1;
        `,
        [id]
      );

      const existingEvent = existingEventResult.rows[0];

      if (!existingEvent) {
        await client.query("ROLLBACK");
        return null;
      }

      const title =
        data.title !== undefined ? data.title : existingEvent.title;
      const description =
        data.description !== undefined
          ? data.description
          : existingEvent.description;
      const event_date =
        data.event_date !== undefined ? data.event_date : existingEvent.event_date;
      const location =
        data.location !== undefined ? data.location : existingEvent.location;
      const category_name =
        data.category_name !== undefined
          ? data.category_name
          : data.primary_category_name !== undefined
          ? data.primary_category_name
          : existingEvent.category_name;

      const updateResult = await client.query(
        `
        UPDATE events
        SET
          title = $1,
          description = $2,
          category_name = $3,
          location = $4,
          event_date = $5
        WHERE id = $6
        RETURNING
          id,
          title,
          description,
          category_name,
          location,
          TO_CHAR(event_date, 'DD/MM/YYYY') AS event_date,
          created_at;
        `,
        [title, description, category_name, location, event_date, id]
      );

      const updatedEvent = updateResult.rows[0];

      if (Array.isArray(data.categories)) {
        const uniqueCategories = [
          ...new Set(
            [category_name, ...data.categories]
              .map((category) =>
                typeof category === "string" ? category.trim() : ""
              )
              .filter(Boolean)
          ),
        ];

        await client.query(
          `
          DELETE FROM event_categories
          WHERE event_id = $1;
          `,
          [id]
        );

        for (const category of uniqueCategories) {
          await client.query(
            `
            INSERT INTO event_categories (event_id, category_name)
            VALUES ($1, $2)
            ON CONFLICT (event_id, category_name) DO NOTHING;
            `,
            [id, category]
          );
        }
      }

      await client.query("COMMIT");

      const finalResult = await db.query(
        `
        SELECT
          e.id,
          e.title,
          e.description,
          e.location,
          TO_CHAR(e.event_date, 'DD/MM/YYYY') AS event_date,
          e.created_at,
          COALESCE(
            ARRAY_AGG(ec.category_name ORDER BY ec.category_name)
            FILTER (WHERE ec.category_name IS NOT NULL),
            ARRAY[]::TEXT[]
          ) AS categories
        FROM events e
        LEFT JOIN event_categories ec
          ON e.id = ec.event_id
        WHERE e.id = $1
        GROUP BY e.id, e.title, e.description, e.location, e.event_date, e.created_at;
        `,
        [id]
      );

      return finalResult.rows[0] || updatedEvent;
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("Error updating event:", err);
      throw err;
    } finally {
      client.release();
    }
  }

  static async deleteById(id) {
    const result = await db.query(
      `
      DELETE FROM events
      WHERE id = $1
      RETURNING *;
      `,
      [id]
    );

    return result.rows[0] || null;
  }

  static async getPopularEvents() {
    const result = await db.query(`
      WITH ranked_interests AS (
        SELECT
          i.name AS category_name,
          COUNT(DISTINCT ui.user_email) AS interested_users
        FROM interests i
        LEFT JOIN user_interests ui
          ON LOWER(TRIM(i.name)) = LOWER(TRIM(ui.interest_name))
        GROUP BY i.name
        ORDER BY interested_users DESC, i.name ASC
        LIMIT 4
      ),
      category_locations AS (
        SELECT
          e.category_name,
          e.location,
          COUNT(DISTINCT e.id) AS total_events,
          ROW_NUMBER() OVER (
            PARTITION BY e.category_name
            ORDER BY COUNT(DISTINCT e.id) DESC, e.location ASC
          ) AS rn
        FROM events e
        WHERE e.category_name IS NOT NULL
          AND e.location IS NOT NULL
        GROUP BY e.category_name, e.location
      ),
      global_location AS (
        SELECT
          location
        FROM events
        WHERE location IS NOT NULL
        GROUP BY location
        ORDER BY COUNT(DISTINCT id) DESC, location ASC
        LIMIT 1
      )
      SELECT
        ROW_NUMBER() OVER (
          ORDER BY ri.interested_users DESC, ri.category_name ASC
        ) AS id,
        ri.category_name,
        ri.category_name || ' Social' AS title,
        'A great choice for bringing together people who already share an interest in ' || ri.category_name || '.' AS description,
        ri.interested_users::text AS interested_count,
        COALESCE(cl.location, gl.location, 'Fully remote') AS best_location,
        ARRAY[ri.category_name] AS categories
      FROM ranked_interests ri
      LEFT JOIN category_locations cl
        ON cl.category_name = ri.category_name
       AND cl.rn = 1
      CROSS JOIN global_location gl
      ORDER BY ri.interested_users DESC, ri.category_name ASC;
    `);

    return result.rows;
  }

  static async getSuggestionInsights() {
    const topInterestsQuery = `
      SELECT
        i.name AS category_name,
        COUNT(DISTINCT ui.user_email) AS interested_users
      FROM interests i
      LEFT JOIN user_interests ui
        ON LOWER(TRIM(i.name)) = LOWER(TRIM(ui.interest_name))
      GROUP BY i.name
      ORDER BY interested_users DESC, i.name ASC;
    `;

    const locationQuery = `
      SELECT
        location,
        COUNT(DISTINCT id) AS total_events
      FROM events
      WHERE location IS NOT NULL
      GROUP BY location
      ORDER BY total_events DESC, location ASC;
    `;

    const categoryLocationQuery = `
      SELECT
        e.category_name,
        e.location,
        COUNT(DISTINCT e.id) AS total_events,
        ROW_NUMBER() OVER (
          PARTITION BY e.category_name
          ORDER BY COUNT(DISTINCT e.id) DESC, e.location ASC
        ) AS rn
      FROM events e
      WHERE e.category_name IS NOT NULL
        AND e.location IS NOT NULL
      GROUP BY e.category_name, e.location;
    `;

    const underusedQuery = `
      SELECT
        i.name AS category_name,
        COUNT(DISTINCT ui.user_email) AS interested_users,
        COUNT(DISTINCT e.id) AS total_events
      FROM interests i
      LEFT JOIN user_interests ui
        ON LOWER(TRIM(i.name)) = LOWER(TRIM(ui.interest_name))
      LEFT JOIN events e
        ON LOWER(TRIM(i.name)) = LOWER(TRIM(e.category_name))
      GROUP BY i.name
      HAVING COUNT(DISTINCT e.id) < 2
      ORDER BY interested_users DESC, total_events ASC, i.name ASC;
    `;

    const [
      topInterestsResult,
      topLocationsResult,
      categoryLocationsResult,
      underusedResult,
    ] = await Promise.all([
      db.query(topInterestsQuery),
      db.query(locationQuery),
      db.query(categoryLocationQuery),
      db.query(underusedQuery),
    ]);

    const categoryBestLocations = categoryLocationsResult.rows
      .filter((row) => Number(row.rn) === 1)
      .map((row) => ({
        category_name: row.category_name,
        best_location: row.location,
        total_events: row.total_events,
      }));

    return {
      topInterests: topInterestsResult.rows,
      topThreeInterests: topInterestsResult.rows.slice(0, 3),
      topLocations: topLocationsResult.rows,
      categoryBestLocations,
      underusedCategories: underusedResult.rows,
    };
  }

  static async getInterestedCountByCategoryAndLocation(category_name, location) {
    if (!category_name) return 0;

    let query = `
      SELECT COUNT(DISTINCT ui.user_email) AS interested_count
      FROM user_interests ui
      WHERE LOWER(TRIM(ui.interest_name)) = LOWER(TRIM($1))
    `;

    const values = [category_name];

    if (location && location.trim()) {
      query = `
        SELECT COUNT(DISTINCT ui.user_email) AS interested_count
        FROM user_interests ui
        JOIN users u
          ON u.email = ui.user_email
        WHERE LOWER(TRIM(ui.interest_name)) = LOWER(TRIM($1))
          AND LOWER(TRIM(COALESCE(u.office_location, ''))) = LOWER(TRIM($2))
      `;
      values.push(location);
    }

    const result = await db.query(query, values);
    return Number(result.rows[0]?.interested_count || 0);
  }

  static async getIdeaValidationInsights(ideaText) {
    console.log("USING MODEL getIdeaValidationInsights");

    const interestsResult = await db.query(`
      SELECT name
      FROM interests
      ORDER BY name ASC;
    `);

    const allInterests = interestsResult.rows.map((row) => row.name);

    const scoredMatches = allInterests
      .map((interestName) => {
        const match = scoreInterestAgainstIdea(ideaText, interestName);
        return {
          category_name: interestName,
          score: match.score,
          reason: match.reason,
        };
      })
      .sort(
        (a, b) =>
          b.score - a.score || a.category_name.localeCompare(b.category_name)
      );

    const bestMatch = scoredMatches[0] || null;

    const matchedCategory =
      bestMatch && bestMatch.score >= 80 ? bestMatch.category_name : null;

    const suggestedCategory =
      !matchedCategory && bestMatch && bestMatch.score >= 45
        ? bestMatch.category_name
        : null;

    const finalCategory = matchedCategory || suggestedCategory;

    let categoryStats = null;
    let locationStats = [];
    let interestStats = null;

    if (finalCategory) {
      const categoryStatsQuery = `
        SELECT
          e.category_name,
          COUNT(DISTINCT e.id) AS total_events,
          COUNT(DISTINCT er.user_email) AS total_registered_users,
          COUNT(CASE WHEN er.status = 'attended' THEN 1 END) AS total_attended,
          COUNT(CASE WHEN er.status = 'cancelled' THEN 1 END) AS total_cancelled,
          COUNT(CASE WHEN er.status = 'registered' THEN 1 END) AS total_registered,
          COUNT(CASE WHEN er.status = 'unresponsive' THEN 1 END) AS total_unresponsive
        FROM events e
        LEFT JOIN event_registrations er
          ON e.id = er.event_id
        WHERE LOWER(TRIM(e.category_name)) = LOWER(TRIM($1))
        GROUP BY e.category_name;
      `;

      const interestStatsQuery = `
        SELECT
          $1 AS category_name,
          COUNT(DISTINCT user_email) AS interested_users
        FROM user_interests
        WHERE LOWER(TRIM(interest_name)) = LOWER(TRIM($1));
      `;

      const locationStatsQuery = `
        SELECT
          e.location,
          COUNT(DISTINCT e.id) AS total_events,
          COUNT(DISTINCT er.user_email) AS total_registered_users,
          COUNT(CASE WHEN er.status = 'attended' THEN 1 END) AS total_attended
        FROM events e
        LEFT JOIN event_registrations er
          ON e.id = er.event_id
        WHERE LOWER(TRIM(e.category_name)) = LOWER(TRIM($1))
        GROUP BY e.location
        ORDER BY total_attended DESC, total_registered_users DESC, total_events DESC, e.location ASC;
      `;

      const [categoryStatsResult, interestStatsResult, locationStatsResult] =
        await Promise.all([
          db.query(categoryStatsQuery, [finalCategory]),
          db.query(interestStatsQuery, [finalCategory]),
          db.query(locationStatsQuery, [finalCategory]),
        ]);

      categoryStats = categoryStatsResult.rows[0] || null;
      interestStats = interestStatsResult.rows[0] || {
        category_name: finalCategory,
        interested_users: "0",
      };
      locationStats = locationStatsResult.rows;
    }

    const topInterestsResult = await db.query(`
      SELECT
        i.name AS category_name,
        COUNT(DISTINCT ui.user_email) AS interested_users
      FROM interests i
      LEFT JOIN user_interests ui
        ON LOWER(TRIM(i.name)) = LOWER(TRIM(ui.interest_name))
      GROUP BY i.name
      ORDER BY interested_users DESC, i.name ASC
      LIMIT 5;
    `);

    return {
      userIdea: ideaText,
      matchedCategory,
      suggestedCategory,
      finalCategory,
      matchScore: bestMatch?.score || 0,
      matchReason: bestMatch?.reason || "none",
      topMatchCandidates: scoredMatches.slice(0, 3),
      categoryStats,
      interestStats,
      locationStats,
      topInterests: topInterestsResult.rows,
    };
  }
}

module.exports = Event;
