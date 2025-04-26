drop trigger if exists "set_updated_at" on "public"."NEW_projects";

drop trigger if exists "update_projects_updated_at" on "public"."projects";

drop trigger if exists "handle_scans_updated_at" on "public"."scans";

drop policy "Enable delete for authenticated users only" on "public"."NEW_projects";

drop policy "Enable insert for authenticated users only" on "public"."NEW_projects";

drop policy "Enable read access for all users" on "public"."NEW_projects";

drop policy "Enable update for authenticated users only" on "public"."NEW_projects";

drop policy "Enable read access for all users" on "public"."github_profiles";

drop policy "Users can delete their own projects" on "public"."projects";

drop policy "Users can insert their own projects" on "public"."projects";

drop policy "Users can update their own projects" on "public"."projects";

drop policy "Users can view their own projects" on "public"."projects";

drop policy "Users can create scans for their own projects" on "public"."scans";

drop policy "Users can create scans for their projects" on "public"."scans";

drop policy "Users can update their own scans" on "public"."scans";

drop policy "Users can view their own project scans" on "public"."scans";

drop policy "Users can view their own scans" on "public"."scans";

drop policy "Users can create attacks for their projects" on "public"."attacks";

drop policy "Users can view attacks for their projects" on "public"."attacks";

drop policy "Users can delete their own project env vars" on "public"."project_env_vars";

drop policy "Users can insert their own project env vars" on "public"."project_env_vars";

drop policy "Users can update their own project env vars" on "public"."project_env_vars";

drop policy "Users can view their own project env vars" on "public"."project_env_vars";

revoke delete on table "public"."NEW_projects" from "anon";

revoke insert on table "public"."NEW_projects" from "anon";

revoke references on table "public"."NEW_projects" from "anon";

revoke select on table "public"."NEW_projects" from "anon";

revoke trigger on table "public"."NEW_projects" from "anon";

revoke truncate on table "public"."NEW_projects" from "anon";

revoke update on table "public"."NEW_projects" from "anon";

revoke delete on table "public"."NEW_projects" from "authenticated";

revoke insert on table "public"."NEW_projects" from "authenticated";

revoke references on table "public"."NEW_projects" from "authenticated";

revoke select on table "public"."NEW_projects" from "authenticated";

revoke trigger on table "public"."NEW_projects" from "authenticated";

revoke truncate on table "public"."NEW_projects" from "authenticated";

revoke update on table "public"."NEW_projects" from "authenticated";

revoke delete on table "public"."NEW_projects" from "service_role";

revoke insert on table "public"."NEW_projects" from "service_role";

revoke references on table "public"."NEW_projects" from "service_role";

revoke select on table "public"."NEW_projects" from "service_role";

revoke trigger on table "public"."NEW_projects" from "service_role";

revoke truncate on table "public"."NEW_projects" from "service_role";

revoke update on table "public"."NEW_projects" from "service_role";

alter table "public"."NEW_projects" drop constraint "NEW_projects_user_id_fkey";

alter table "public"."code_files" drop constraint "code_files_project_id_file_path_key";

alter table "public"."projects" drop constraint "projects_user_id_repository_id_key";

alter table "public"."scans" drop constraint "risk_score_check";

alter table "public"."scans" drop constraint "scan_type_check";

alter table "public"."scans" drop constraint "status_check";

alter table "public"."attacks" drop constraint "attacks_project_id_fkey";

alter table "public"."project_env_vars" drop constraint "project_env_vars_project_id_fkey";

alter table "public"."NEW_projects" drop constraint "NEW_projects_pkey";

alter table "public"."projects" drop constraint "projects_pkey";

drop index if exists "public"."code_files_file_path_idx";

drop index if exists "public"."code_files_project_id_file_path_key";

drop index if exists "public"."code_files_project_id_idx";

drop index if exists "public"."NEW_projects_pkey";

drop index if exists "public"."projects_pkey";

drop index if exists "public"."projects_user_id_idx";

drop index if exists "public"."projects_user_id_repository_id_key";

drop table "public"."NEW_projects";

create table "public"."OLD_projects" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" text not null,
    "name" character varying(255) not null,
    "description" text,
    "target_url" text not null,
    "scan_frequency" scan_frequency not null default 'weekly'::scan_frequency,
    "repository_id" bigint not null,
    "repository_full_name" character varying(255) not null,
    "repository_name" character varying(255) not null,
    "repository_description" text,
    "repository_is_private" boolean not null default false,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "metadata" jsonb,
    "repository" jsonb
);


create table "public"."test_bg_tasks" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "data" text,
    "finished" boolean not null default false
);


alter table "public"."code_files" drop column "file_name";

alter table "public"."code_files" drop column "sha";

alter table "public"."code_files" add column "branch_name" text default 'main'::text;

alter table "public"."code_files" add column "commit_hash" text;

alter table "public"."code_files" alter column "content" drop not null;

alter table "public"."code_files" alter column "created_at" set default now();

alter table "public"."code_files" alter column "created_at" drop not null;

alter table "public"."code_files" alter column "id" set default gen_random_uuid();

alter table "public"."code_files" alter column "language" drop not null;

alter table "public"."code_files" alter column "last_scanned_at" drop default;

alter table "public"."code_files" alter column "last_scanned_at" drop not null;

alter table "public"."code_files" alter column "updated_at" set default now();

alter table "public"."code_files" alter column "updated_at" drop not null;

alter table "public"."code_files" enable row level security;

alter table "public"."projects" drop column "metadata";

alter table "public"."projects" drop column "name";

alter table "public"."projects" drop column "repository";

alter table "public"."projects" drop column "repository_is_private";

alter table "public"."projects" add column "env_vars" jsonb default '{}'::jsonb;

alter table "public"."projects" add column "project_name" text not null;

alter table "public"."projects" add column "repository_url" text;

alter table "public"."projects" alter column "repository_full_name" drop not null;

alter table "public"."projects" alter column "repository_full_name" set data type text using "repository_full_name"::text;

alter table "public"."projects" alter column "repository_id" drop not null;

alter table "public"."projects" alter column "repository_id" set data type text using "repository_id"::text;

alter table "public"."projects" alter column "repository_name" drop not null;

alter table "public"."projects" alter column "repository_name" set data type text using "repository_name"::text;

alter table "public"."projects" alter column "scan_frequency" drop default;

alter table "public"."projects" alter column "scan_frequency" drop not null;

alter table "public"."projects" alter column "scan_frequency" set data type text using "scan_frequency"::text;

alter table "public"."projects" alter column "target_url" drop not null;

alter table "public"."projects" alter column "user_id" drop not null;

alter table "public"."projects" alter column "user_id" set data type uuid using "user_id"::uuid;

alter table "public"."projects" enable row level security;

alter table "public"."scans" drop column "auth_id";

alter table "public"."scans" add column "branch" text;

alter table "public"."scans" add column "commit_hash" text;

alter table "public"."scans" add column "current_stage" text;

alter table "public"."scans" add column "files_scanned" integer default 0;

alter table "public"."scans" add column "progress_percentage" integer default 0;

alter table "public"."scans" add column "vulnerability_types" text[] default '{}'::text[];

alter table "public"."scans" alter column "created_at" drop not null;

alter table "public"."scans" alter column "id" set default gen_random_uuid();

alter table "public"."scans" alter column "project_id" drop not null;

alter table "public"."scans" alter column "risk_score" set default 0;

alter table "public"."scans" alter column "scan_type" drop default;

alter table "public"."scans" alter column "status" drop default;

alter table "public"."scans" alter column "target_components" set default '[]'::jsonb;

alter table "public"."scans" alter column "target_components" set data type jsonb using "target_components"::jsonb;

alter table "public"."scans" alter column "triggered_by" drop default;

alter table "public"."scans" alter column "triggered_by" drop not null;

alter table "public"."scans" alter column "triggered_by" set data type uuid using "triggered_by"::uuid;

alter table "public"."scans" alter column "updated_at" drop default;

alter table "public"."scans" alter column "updated_at" drop not null;

alter table "public"."scans" enable row level security;

alter table "public"."vulnerabilities" add column "code_snippet" text;

alter table "public"."vulnerabilities" add column "file_path" text;

alter table "public"."vulnerabilities" add column "line_end" integer;

alter table "public"."vulnerabilities" add column "line_start" integer;

alter table "public"."vulnerabilities" add column "scan_id" uuid;

alter table "public"."vulnerabilities" alter column "affected_components" drop default;

alter table "public"."vulnerabilities" alter column "description" drop not null;

alter table "public"."vulnerabilities" alter column "reference_urls" drop default;

alter table "public"."vulnerabilities" alter column "severity" set data type text using "severity"::text;

alter table "public"."vulnerabilities" alter column "status" drop default;

alter table "public"."vulnerabilities" alter column "status" set data type text using "status"::text;

alter table "public"."vulnerabilities" enable row level security;

CREATE UNIQUE INDEX code_files_project_id_file_path_branch_name_key ON public.code_files USING btree (project_id, file_path, branch_name);

CREATE INDEX idx_code_files_path ON public.code_files USING btree (file_path);

CREATE INDEX idx_code_files_path_branch ON public.code_files USING btree (file_path, branch_name);

CREATE INDEX idx_code_files_project_id ON public.code_files USING btree (project_id);

CREATE INDEX idx_scans_project_id ON public.scans USING btree (project_id);

CREATE INDEX idx_vulnerabilities_project_id ON public.vulnerabilities USING btree (project_id);

CREATE INDEX idx_vulnerabilities_scan_id ON public.vulnerabilities USING btree (scan_id);

CREATE UNIQUE INDEX test_bg_tasks_pkey ON public.test_bg_tasks USING btree (id);

CREATE UNIQUE INDEX "NEW_projects_pkey" ON public.projects USING btree (id);

CREATE UNIQUE INDEX projects_pkey ON public."OLD_projects" USING btree (id);

CREATE INDEX projects_user_id_idx ON public."OLD_projects" USING btree (user_id);

CREATE UNIQUE INDEX projects_user_id_repository_id_key ON public."OLD_projects" USING btree (user_id, repository_id);

alter table "public"."OLD_projects" add constraint "projects_pkey" PRIMARY KEY using index "projects_pkey";

alter table "public"."projects" add constraint "NEW_projects_pkey" PRIMARY KEY using index "NEW_projects_pkey";

alter table "public"."test_bg_tasks" add constraint "test_bg_tasks_pkey" PRIMARY KEY using index "test_bg_tasks_pkey";

alter table "public"."OLD_projects" add constraint "projects_user_id_repository_id_key" UNIQUE using index "projects_user_id_repository_id_key";

alter table "public"."code_files" add constraint "code_files_project_id_file_path_branch_name_key" UNIQUE using index "code_files_project_id_file_path_branch_name_key";

alter table "public"."projects" add constraint "NEW_projects_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."projects" validate constraint "NEW_projects_user_id_fkey";

alter table "public"."scans" add constraint "scans_scan_type_check" CHECK ((scan_type = ANY (ARRAY['full'::text, 'incremental'::text, 'targeted'::text]))) not valid;

alter table "public"."scans" validate constraint "scans_scan_type_check";

alter table "public"."scans" add constraint "scans_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'running'::text, 'completed'::text, 'failed'::text]))) not valid;

alter table "public"."scans" validate constraint "scans_status_check";

alter table "public"."scans" add constraint "scans_triggered_by_fkey" FOREIGN KEY (triggered_by) REFERENCES auth.users(id) not valid;

alter table "public"."scans" validate constraint "scans_triggered_by_fkey";

alter table "public"."vulnerabilities" add constraint "vulnerabilities_scan_id_fkey" FOREIGN KEY (scan_id) REFERENCES scans(id) ON DELETE CASCADE not valid;

alter table "public"."vulnerabilities" validate constraint "vulnerabilities_scan_id_fkey";

alter table "public"."vulnerabilities" add constraint "vulnerabilities_severity_check" CHECK ((severity = ANY (ARRAY['critical'::text, 'high'::text, 'medium'::text, 'low'::text]))) not valid;

alter table "public"."vulnerabilities" validate constraint "vulnerabilities_severity_check";

alter table "public"."vulnerabilities" add constraint "vulnerabilities_status_check" CHECK ((status = ANY (ARRAY['open'::text, 'in_progress'::text, 'resolved'::text, 'false_positive'::text]))) not valid;

alter table "public"."vulnerabilities" validate constraint "vulnerabilities_status_check";

alter table "public"."attacks" add constraint "attacks_project_id_fkey" FOREIGN KEY (project_id) REFERENCES "OLD_projects"(id) ON DELETE CASCADE not valid;

alter table "public"."attacks" validate constraint "attacks_project_id_fkey";

alter table "public"."project_env_vars" add constraint "project_env_vars_project_id_fkey" FOREIGN KEY (project_id) REFERENCES "OLD_projects"(id) ON DELETE CASCADE not valid;

alter table "public"."project_env_vars" validate constraint "project_env_vars_project_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_timestamp()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$
;

grant delete on table "public"."OLD_projects" to "anon";

grant insert on table "public"."OLD_projects" to "anon";

grant references on table "public"."OLD_projects" to "anon";

grant select on table "public"."OLD_projects" to "anon";

grant trigger on table "public"."OLD_projects" to "anon";

grant truncate on table "public"."OLD_projects" to "anon";

grant update on table "public"."OLD_projects" to "anon";

grant delete on table "public"."OLD_projects" to "authenticated";

grant insert on table "public"."OLD_projects" to "authenticated";

grant references on table "public"."OLD_projects" to "authenticated";

grant select on table "public"."OLD_projects" to "authenticated";

grant trigger on table "public"."OLD_projects" to "authenticated";

grant truncate on table "public"."OLD_projects" to "authenticated";

grant update on table "public"."OLD_projects" to "authenticated";

grant delete on table "public"."OLD_projects" to "service_role";

grant insert on table "public"."OLD_projects" to "service_role";

grant references on table "public"."OLD_projects" to "service_role";

grant select on table "public"."OLD_projects" to "service_role";

grant trigger on table "public"."OLD_projects" to "service_role";

grant truncate on table "public"."OLD_projects" to "service_role";

grant update on table "public"."OLD_projects" to "service_role";

grant delete on table "public"."test_bg_tasks" to "anon";

grant insert on table "public"."test_bg_tasks" to "anon";

grant references on table "public"."test_bg_tasks" to "anon";

grant select on table "public"."test_bg_tasks" to "anon";

grant trigger on table "public"."test_bg_tasks" to "anon";

grant truncate on table "public"."test_bg_tasks" to "anon";

grant update on table "public"."test_bg_tasks" to "anon";

grant delete on table "public"."test_bg_tasks" to "authenticated";

grant insert on table "public"."test_bg_tasks" to "authenticated";

grant references on table "public"."test_bg_tasks" to "authenticated";

grant select on table "public"."test_bg_tasks" to "authenticated";

grant trigger on table "public"."test_bg_tasks" to "authenticated";

grant truncate on table "public"."test_bg_tasks" to "authenticated";

grant update on table "public"."test_bg_tasks" to "authenticated";

grant delete on table "public"."test_bg_tasks" to "service_role";

grant insert on table "public"."test_bg_tasks" to "service_role";

grant references on table "public"."test_bg_tasks" to "service_role";

grant select on table "public"."test_bg_tasks" to "service_role";

grant trigger on table "public"."test_bg_tasks" to "service_role";

grant truncate on table "public"."test_bg_tasks" to "service_role";

grant update on table "public"."test_bg_tasks" to "service_role";

create policy "Users can delete their own projects"
on "public"."OLD_projects"
as permissive
for delete
to public
using (((auth.uid())::text = user_id));


create policy "Users can insert their own projects"
on "public"."OLD_projects"
as permissive
for insert
to public
with check (((auth.uid())::text = user_id));


create policy "Users can update their own projects"
on "public"."OLD_projects"
as permissive
for update
to public
using (((auth.uid())::text = user_id));


create policy "Users can view their own projects"
on "public"."OLD_projects"
as permissive
for select
to public
using (((auth.uid())::text = user_id));


create policy "code_files_policy"
on "public"."code_files"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM projects p
  WHERE ((p.id = code_files.project_id) AND (p.user_id = auth.uid())))));


create policy "Enable upsert for authenticated users only"
on "public"."github_profiles"
as permissive
for update
to authenticated
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));


create policy "Enable users to view their own data only"
on "public"."github_profiles"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable delete for authenticated users only"
on "public"."projects"
as permissive
for delete
to authenticated
using ((auth.uid() IS NOT NULL));


create policy "Enable insert for authenticated users only"
on "public"."projects"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."projects"
as permissive
for select
to public
using (true);


create policy "Enable update for authenticated users only"
on "public"."projects"
as permissive
for update
to authenticated
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));


create policy "Enable delete for users based on user_id"
on "public"."scans"
as permissive
for delete
to public
using ((EXISTS ( SELECT 1
   FROM projects p
  WHERE ((p.id = scans.project_id) AND (p.user_id = auth.uid())))));


create policy "Enable insert for authenticated users only"
on "public"."scans"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM projects p
  WHERE ((p.id = scans.project_id) AND (p.user_id = auth.uid())))));


create policy "Enable update for authenticated users only"
on "public"."scans"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM projects p
  WHERE ((p.id = scans.project_id) AND (p.user_id = auth.uid())))))
with check ((EXISTS ( SELECT 1
   FROM projects p
  WHERE ((p.id = scans.project_id) AND (p.user_id = auth.uid())))));


create policy "Enable users to view their own data only"
on "public"."scans"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM projects p
  WHERE ((p.id = scans.project_id) AND (p.user_id = auth.uid())))));


create policy "vulnerabilities_policy"
on "public"."vulnerabilities"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM (scans s
     JOIN projects p ON ((s.project_id = p.id)))
  WHERE ((s.id = vulnerabilities.scan_id) AND (p.user_id = auth.uid())))));


create policy "Users can create attacks for their projects"
on "public"."attacks"
as permissive
for insert
to public
with check ((EXISTS ( SELECT 1
   FROM "OLD_projects"
  WHERE (("OLD_projects".id = attacks.project_id) AND ("OLD_projects".user_id = (auth.uid())::text)))));


create policy "Users can view attacks for their projects"
on "public"."attacks"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM "OLD_projects"
  WHERE (("OLD_projects".id = attacks.project_id) AND ("OLD_projects".user_id = (auth.uid())::text)))));


create policy "Users can delete their own project env vars"
on "public"."project_env_vars"
as permissive
for delete
to public
using ((EXISTS ( SELECT 1
   FROM "OLD_projects"
  WHERE (("OLD_projects".id = project_env_vars.project_id) AND ("OLD_projects".user_id = (auth.uid())::text)))));


create policy "Users can insert their own project env vars"
on "public"."project_env_vars"
as permissive
for insert
to public
with check ((EXISTS ( SELECT 1
   FROM "OLD_projects"
  WHERE (("OLD_projects".id = project_env_vars.project_id) AND ("OLD_projects".user_id = (auth.uid())::text)))));


create policy "Users can update their own project env vars"
on "public"."project_env_vars"
as permissive
for update
to public
using ((EXISTS ( SELECT 1
   FROM "OLD_projects"
  WHERE (("OLD_projects".id = project_env_vars.project_id) AND ("OLD_projects".user_id = (auth.uid())::text)))));


create policy "Users can view their own project env vars"
on "public"."project_env_vars"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM "OLD_projects"
  WHERE (("OLD_projects".id = project_env_vars.project_id) AND ("OLD_projects".user_id = (auth.uid())::text)))));


CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public."OLD_projects" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_code_files_timestamp BEFORE UPDATE ON public.code_files FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vulnerabilities_timestamp BEFORE UPDATE ON public.vulnerabilities FOR EACH ROW EXECUTE FUNCTION update_timestamp();


