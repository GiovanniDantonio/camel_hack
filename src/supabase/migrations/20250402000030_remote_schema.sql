
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

COMMENT ON SCHEMA "public" IS 'standard public schema';

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE TYPE "public"."attack_status" AS ENUM (
    'pending',
    'running',
    'completed',
    'failed'
);

ALTER TYPE "public"."attack_status" OWNER TO "postgres";

CREATE TYPE "public"."attack_type" AS ENUM (
    'sql_injection',
    'xss',
    'csrf',
    'rce',
    'ssrf',
    'other'
);

ALTER TYPE "public"."attack_type" OWNER TO "postgres";

CREATE TYPE "public"."scan_frequency" AS ENUM (
    'daily',
    'weekly',
    'monthly'
);

ALTER TYPE "public"."scan_frequency" OWNER TO "postgres";

CREATE TYPE "public"."vulnerability_severity" AS ENUM (
    'critical',
    'high',
    'medium',
    'low'
);

ALTER TYPE "public"."vulnerability_severity" OWNER TO "postgres";

CREATE TYPE "public"."vulnerability_status" AS ENUM (
    'open',
    'in_progress',
    'resolved'
);

ALTER TYPE "public"."vulnerability_status" OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_github_token"() RETURNS "text"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  v_token TEXT;
BEGIN
  -- Get the current user's GitHub token
  -- This uses auth.uid() which gives us the ID of the currently authenticated user
  SELECT github_access_token INTO v_token
  FROM auth.users
  WHERE id = auth.uid();
  
  RETURN v_token;
END;
$$;

ALTER FUNCTION "public"."get_github_token"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, avatar_url)
    VALUES (
        new.id,
        new.raw_user_meta_data->>'full_name',
        new.email,
        new.raw_user_meta_data->>'avatar_url'
    );
    RETURN new;
END;
$$;

ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."handle_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
    new.updated_at = now();
    return new;
end;
$$;

ALTER FUNCTION "public"."handle_updated_at"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."save_github_token"("p_github_token" "text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  -- Update the current user's github_access_token
  -- This uses auth.uid() which gives us the ID of the currently authenticated user
  UPDATE auth.users
  SET github_access_token = p_github_token
  WHERE id = auth.uid();
END;
$$;

ALTER FUNCTION "public"."save_github_token"("p_github_token" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."attacks" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" "uuid",
    "triggered_by" "uuid" NOT NULL,
    "attack_type" "public"."attack_type" NOT NULL,
    "target_component" "text" NOT NULL,
    "status" "public"."attack_status" DEFAULT 'pending'::"public"."attack_status" NOT NULL,
    "result_summary" "text",
    "execution_logs" "text",
    "parameters" "jsonb",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);

ALTER TABLE "public"."attacks" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."code_files" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "project_id" "uuid",
    "file_path" "text" NOT NULL,
    "file_name" "text" NOT NULL,
    "language" "text" NOT NULL,
    "content" "text" NOT NULL,
    "sha" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "last_scanned_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);

ALTER TABLE "public"."code_files" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."project_env_vars" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" "uuid" NOT NULL,
    "key" character varying(255) NOT NULL,
    "value" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE "public"."project_env_vars" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."projects" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "text" NOT NULL,
    "name" character varying(255) NOT NULL,
    "description" "text",
    "target_url" "text" NOT NULL,
    "scan_frequency" "public"."scan_frequency" DEFAULT 'weekly'::"public"."scan_frequency" NOT NULL,
    "repository_id" bigint NOT NULL,
    "repository_full_name" character varying(255) NOT NULL,
    "repository_name" character varying(255) NOT NULL,
    "repository_description" "text",
    "repository_is_private" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "metadata" "jsonb",
    "repository" "jsonb"
);

ALTER TABLE "public"."projects" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."scans" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "project_id" "uuid" NOT NULL,
    "triggered_by" "text" DEFAULT "gen_random_uuid"() NOT NULL,
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "started_at" timestamp with time zone,
    "completed_at" timestamp with time zone,
    "scan_type" "text" DEFAULT 'full'::"text" NOT NULL,
    "target_components" "text"[],
    "execution_logs" "text",
    "result_summary" "text",
    "vulnerabilities_found" integer DEFAULT 0,
    "risk_score" integer,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "auth_id" "text",
    CONSTRAINT "risk_score_check" CHECK ((("risk_score" >= 0) AND ("risk_score" <= 100))),
    CONSTRAINT "scan_type_check" CHECK (("scan_type" = ANY (ARRAY['full'::"text", 'incremental'::"text", 'targeted'::"text"]))),
    CONSTRAINT "status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'running'::"text", 'completed'::"text", 'failed'::"text"])))
);

ALTER TABLE "public"."scans" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."vulnerabilities" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" "uuid",
    "severity" "public"."vulnerability_severity" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text" NOT NULL,
    "location" "text" NOT NULL,
    "detected_at" timestamp with time zone DEFAULT "now"(),
    "status" "public"."vulnerability_status" DEFAULT 'open'::"public"."vulnerability_status" NOT NULL,
    "cve" "text",
    "remediation" "text",
    "affected_components" "text"[] DEFAULT ARRAY[]::"text"[],
    "reference_urls" "text"[] DEFAULT ARRAY[]::"text"[],
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE "public"."vulnerabilities" OWNER TO "postgres";

ALTER TABLE ONLY "public"."attacks"
    ADD CONSTRAINT "attacks_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."code_files"
    ADD CONSTRAINT "code_files_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."code_files"
    ADD CONSTRAINT "code_files_project_id_file_path_key" UNIQUE ("project_id", "file_path");

ALTER TABLE ONLY "public"."project_env_vars"
    ADD CONSTRAINT "project_env_vars_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."project_env_vars"
    ADD CONSTRAINT "project_env_vars_project_id_key_key" UNIQUE ("project_id", "key");

ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_user_id_repository_id_key" UNIQUE ("user_id", "repository_id");

ALTER TABLE ONLY "public"."scans"
    ADD CONSTRAINT "scans_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."vulnerabilities"
    ADD CONSTRAINT "vulnerabilities_pkey" PRIMARY KEY ("id");

CREATE INDEX "attacks_created_at_idx" ON "public"."attacks" USING "btree" ("created_at");

CREATE INDEX "attacks_project_id_idx" ON "public"."attacks" USING "btree" ("project_id");

CREATE INDEX "attacks_status_idx" ON "public"."attacks" USING "btree" ("status");

CREATE INDEX "attacks_triggered_by_idx" ON "public"."attacks" USING "btree" ("triggered_by");

CREATE INDEX "code_files_file_path_idx" ON "public"."code_files" USING "btree" ("file_path");

CREATE INDEX "code_files_project_id_idx" ON "public"."code_files" USING "btree" ("project_id");

CREATE INDEX "projects_user_id_idx" ON "public"."projects" USING "btree" ("user_id");

CREATE OR REPLACE TRIGGER "handle_attacks_updated_at" BEFORE UPDATE ON "public"."attacks" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();

CREATE OR REPLACE TRIGGER "handle_scans_updated_at" BEFORE UPDATE ON "public"."scans" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();

CREATE OR REPLACE TRIGGER "update_project_env_vars_updated_at" BEFORE UPDATE ON "public"."project_env_vars" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();

CREATE OR REPLACE TRIGGER "update_projects_updated_at" BEFORE UPDATE ON "public"."projects" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();

ALTER TABLE ONLY "public"."attacks"
    ADD CONSTRAINT "attacks_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."code_files"
    ADD CONSTRAINT "code_files_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."project_env_vars"
    ADD CONSTRAINT "project_env_vars_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."scans"
    ADD CONSTRAINT "scans_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."vulnerabilities"
    ADD CONSTRAINT "vulnerabilities_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;

CREATE POLICY "Users can create attacks for their projects" ON "public"."attacks" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."projects"
  WHERE (("projects"."id" = "attacks"."project_id") AND ("projects"."user_id" = ("auth"."uid"())::"text")))));

CREATE POLICY "Users can create scans for their own projects" ON "public"."scans" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."projects"
  WHERE ((("projects"."id")::"text" = ("scans"."project_id")::"text") AND ("projects"."user_id" = ("auth"."uid"())::"text")))));

CREATE POLICY "Users can create scans for their projects" ON "public"."scans" FOR INSERT WITH CHECK (("project_id" IN ( SELECT "projects"."id"
   FROM "public"."projects"
  WHERE ("projects"."user_id" = ("auth"."jwt"() ->> 'sub'::"text")))));

CREATE POLICY "Users can delete their own project env vars" ON "public"."project_env_vars" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM "public"."projects"
  WHERE (("projects"."id" = "project_env_vars"."project_id") AND ("projects"."user_id" = ("auth"."uid"())::"text")))));

CREATE POLICY "Users can delete their own projects" ON "public"."projects" FOR DELETE USING ((("auth"."uid"())::"text" = "user_id"));

CREATE POLICY "Users can insert their own project env vars" ON "public"."project_env_vars" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."projects"
  WHERE (("projects"."id" = "project_env_vars"."project_id") AND ("projects"."user_id" = ("auth"."uid"())::"text")))));

CREATE POLICY "Users can insert their own projects" ON "public"."projects" FOR INSERT WITH CHECK ((("auth"."uid"())::"text" = "user_id"));

CREATE POLICY "Users can update their own project env vars" ON "public"."project_env_vars" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."projects"
  WHERE (("projects"."id" = "project_env_vars"."project_id") AND ("projects"."user_id" = ("auth"."uid"())::"text")))));

CREATE POLICY "Users can update their own projects" ON "public"."projects" FOR UPDATE USING ((("auth"."uid"())::"text" = "user_id"));

CREATE POLICY "Users can update their own scans" ON "public"."scans" FOR UPDATE USING (("project_id" IN ( SELECT "projects"."id"
   FROM "public"."projects"
  WHERE ("projects"."user_id" = ("auth"."jwt"() ->> 'sub'::"text"))))) WITH CHECK (("project_id" IN ( SELECT "projects"."id"
   FROM "public"."projects"
  WHERE ("projects"."user_id" = ("auth"."jwt"() ->> 'sub'::"text")))));

CREATE POLICY "Users can view attacks for their projects" ON "public"."attacks" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."projects"
  WHERE (("projects"."id" = "attacks"."project_id") AND ("projects"."user_id" = ("auth"."uid"())::"text")))));

CREATE POLICY "Users can view their own project env vars" ON "public"."project_env_vars" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."projects"
  WHERE (("projects"."id" = "project_env_vars"."project_id") AND ("projects"."user_id" = ("auth"."uid"())::"text")))));

CREATE POLICY "Users can view their own project scans" ON "public"."scans" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."projects"
  WHERE ((("projects"."id")::"text" = ("scans"."project_id")::"text") AND ("projects"."user_id" = ("auth"."uid"())::"text")))));

CREATE POLICY "Users can view their own projects" ON "public"."projects" FOR SELECT USING ((("auth"."uid"())::"text" = "user_id"));

CREATE POLICY "Users can view their own scans" ON "public"."scans" FOR SELECT USING (("project_id" IN ( SELECT "projects"."id"
   FROM "public"."projects"
  WHERE ("projects"."user_id" = ("auth"."jwt"() ->> 'sub'::"text")))));

ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."get_github_token"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_github_token"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_github_token"() TO "service_role";

GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";

GRANT ALL ON FUNCTION "public"."handle_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_updated_at"() TO "service_role";

GRANT ALL ON FUNCTION "public"."save_github_token"("p_github_token" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."save_github_token"("p_github_token" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."save_github_token"("p_github_token" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";

GRANT ALL ON TABLE "public"."attacks" TO "anon";
GRANT ALL ON TABLE "public"."attacks" TO "authenticated";
GRANT ALL ON TABLE "public"."attacks" TO "service_role";

GRANT ALL ON TABLE "public"."code_files" TO "anon";
GRANT ALL ON TABLE "public"."code_files" TO "authenticated";
GRANT ALL ON TABLE "public"."code_files" TO "service_role";

GRANT ALL ON TABLE "public"."project_env_vars" TO "anon";
GRANT ALL ON TABLE "public"."project_env_vars" TO "authenticated";
GRANT ALL ON TABLE "public"."project_env_vars" TO "service_role";

GRANT ALL ON TABLE "public"."projects" TO "anon";
GRANT ALL ON TABLE "public"."projects" TO "authenticated";
GRANT ALL ON TABLE "public"."projects" TO "service_role";

GRANT ALL ON TABLE "public"."scans" TO "anon";
GRANT ALL ON TABLE "public"."scans" TO "authenticated";
GRANT ALL ON TABLE "public"."scans" TO "service_role";

GRANT ALL ON TABLE "public"."vulnerabilities" TO "anon";
GRANT ALL ON TABLE "public"."vulnerabilities" TO "authenticated";
GRANT ALL ON TABLE "public"."vulnerabilities" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
