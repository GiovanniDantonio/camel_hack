drop trigger if exists "update_projects_updated_at" on "public"."OLD_projects";

drop trigger if exists "set_updated_at" on "public"."projects";

drop policy "Users can delete their own projects" on "public"."OLD_projects";

drop policy "Users can insert their own projects" on "public"."OLD_projects";

drop policy "Users can update their own projects" on "public"."OLD_projects";

drop policy "Users can view their own projects" on "public"."OLD_projects";

drop policy "Enable read access for all users" on "public"."projects";

drop policy "Users can create attacks for their projects" on "public"."attacks";

drop policy "Users can view attacks for their projects" on "public"."attacks";

drop policy "Users can delete their own project env vars" on "public"."project_env_vars";

drop policy "Users can insert their own project env vars" on "public"."project_env_vars";

drop policy "Users can update their own project env vars" on "public"."project_env_vars";

drop policy "Users can view their own project env vars" on "public"."project_env_vars";

drop policy "Users can create scans for their own projects" on "public"."scans";

drop policy "Users can create scans for their projects" on "public"."scans";

drop policy "Users can update their own scans" on "public"."scans";

drop policy "Users can view their own project scans" on "public"."scans";

drop policy "Users can view their own scans" on "public"."scans";

revoke delete on table "public"."OLD_projects" from "anon";

revoke insert on table "public"."OLD_projects" from "anon";

revoke references on table "public"."OLD_projects" from "anon";

revoke select on table "public"."OLD_projects" from "anon";

revoke trigger on table "public"."OLD_projects" from "anon";

revoke truncate on table "public"."OLD_projects" from "anon";

revoke update on table "public"."OLD_projects" from "anon";

revoke delete on table "public"."OLD_projects" from "authenticated";

revoke insert on table "public"."OLD_projects" from "authenticated";

revoke references on table "public"."OLD_projects" from "authenticated";

revoke select on table "public"."OLD_projects" from "authenticated";

revoke trigger on table "public"."OLD_projects" from "authenticated";

revoke truncate on table "public"."OLD_projects" from "authenticated";

revoke update on table "public"."OLD_projects" from "authenticated";

revoke delete on table "public"."OLD_projects" from "service_role";

revoke insert on table "public"."OLD_projects" from "service_role";

revoke references on table "public"."OLD_projects" from "service_role";

revoke select on table "public"."OLD_projects" from "service_role";

revoke trigger on table "public"."OLD_projects" from "service_role";

revoke truncate on table "public"."OLD_projects" from "service_role";

revoke update on table "public"."OLD_projects" from "service_role";

alter table "public"."OLD_projects" drop constraint "projects_user_id_repository_id_key";

alter table "public"."projects" drop constraint "projects_user_id_fkey";

alter table "public"."attacks" drop constraint "attacks_project_id_fkey";

alter table "public"."code_files" drop constraint "code_files_project_id_fkey";

alter table "public"."project_env_vars" drop constraint "project_env_vars_project_id_fkey";

alter table "public"."scans" drop constraint "scans_project_id_fkey";

alter table "public"."vulnerabilities" drop constraint "vulnerabilities_project_id_fkey";

alter table "public"."OLD_projects" drop constraint "projects_pkey";

alter table "public"."projects" drop constraint "projects_pkey1";

drop index if exists "public"."projects_pkey";

drop index if exists "public"."projects_pkey1";

drop index if exists "public"."projects_user_id_idx";

drop index if exists "public"."projects_user_id_repository_id_key";

drop table "public"."OLD_projects";

create table "public"."NEW_projects" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "project_name" text not null,
    "description" text,
    "scan_frequency" text,
    "repository_url" text,
    "repository_id" text,
    "repository_full_name" text,
    "repository_name" text,
    "repository_description" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."NEW_projects" enable row level security;

alter table "public"."github_profiles" enable row level security;

alter table "public"."projects" drop column "project_name";

alter table "public"."projects" drop column "repository_url";

alter table "public"."projects" add column "metadata" jsonb;

alter table "public"."projects" add column "name" character varying(255) not null;

alter table "public"."projects" add column "repository" jsonb;

alter table "public"."projects" add column "repository_is_private" boolean not null default false;

alter table "public"."projects" add column "target_url" text not null;

alter table "public"."projects" alter column "repository_full_name" set not null;

alter table "public"."projects" alter column "repository_full_name" set data type character varying(255) using "repository_full_name"::character varying(255);

alter table "public"."projects" alter column "repository_id" set not null;

alter table "public"."projects" alter column "repository_id" set data type bigint using "repository_id"::bigint;

alter table "public"."projects" alter column "repository_name" set not null;

alter table "public"."projects" alter column "repository_name" set data type character varying(255) using "repository_name"::character varying(255);

alter table "public"."projects" alter column "scan_frequency" set default 'weekly'::scan_frequency;

alter table "public"."projects" alter column "scan_frequency" set not null;

alter table "public"."projects" alter column "scan_frequency" set data type scan_frequency using "scan_frequency"::scan_frequency;

alter table "public"."projects" alter column "user_id" set not null;

alter table "public"."projects" alter column "user_id" set data type text using "user_id"::text;

alter table "public"."projects" disable row level security;

CREATE UNIQUE INDEX projects_pkey ON public.projects USING btree (id);

CREATE UNIQUE INDEX projects_pkey1 ON public."NEW_projects" USING btree (id);

CREATE INDEX projects_user_id_idx ON public.projects USING btree (user_id);

CREATE UNIQUE INDEX projects_user_id_repository_id_key ON public.projects USING btree (user_id, repository_id);

alter table "public"."NEW_projects" add constraint "projects_pkey1" PRIMARY KEY using index "projects_pkey1";

alter table "public"."projects" add constraint "projects_pkey" PRIMARY KEY using index "projects_pkey";

alter table "public"."NEW_projects" add constraint "projects_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."NEW_projects" validate constraint "projects_user_id_fkey";

alter table "public"."projects" add constraint "projects_user_id_repository_id_key" UNIQUE using index "projects_user_id_repository_id_key";

alter table "public"."attacks" add constraint "attacks_project_id_fkey" FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE not valid;

alter table "public"."attacks" validate constraint "attacks_project_id_fkey";

alter table "public"."code_files" add constraint "code_files_project_id_fkey" FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE not valid;

alter table "public"."code_files" validate constraint "code_files_project_id_fkey";

alter table "public"."project_env_vars" add constraint "project_env_vars_project_id_fkey" FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE not valid;

alter table "public"."project_env_vars" validate constraint "project_env_vars_project_id_fkey";

alter table "public"."scans" add constraint "scans_project_id_fkey" FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE not valid;

alter table "public"."scans" validate constraint "scans_project_id_fkey";

alter table "public"."vulnerabilities" add constraint "vulnerabilities_project_id_fkey" FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE not valid;

alter table "public"."vulnerabilities" validate constraint "vulnerabilities_project_id_fkey";

grant delete on table "public"."NEW_projects" to "anon";

grant insert on table "public"."NEW_projects" to "anon";

grant references on table "public"."NEW_projects" to "anon";

grant select on table "public"."NEW_projects" to "anon";

grant trigger on table "public"."NEW_projects" to "anon";

grant truncate on table "public"."NEW_projects" to "anon";

grant update on table "public"."NEW_projects" to "anon";

grant delete on table "public"."NEW_projects" to "authenticated";

grant insert on table "public"."NEW_projects" to "authenticated";

grant references on table "public"."NEW_projects" to "authenticated";

grant select on table "public"."NEW_projects" to "authenticated";

grant trigger on table "public"."NEW_projects" to "authenticated";

grant truncate on table "public"."NEW_projects" to "authenticated";

grant update on table "public"."NEW_projects" to "authenticated";

grant delete on table "public"."NEW_projects" to "service_role";

grant insert on table "public"."NEW_projects" to "service_role";

grant references on table "public"."NEW_projects" to "service_role";

grant select on table "public"."NEW_projects" to "service_role";

grant trigger on table "public"."NEW_projects" to "service_role";

grant truncate on table "public"."NEW_projects" to "service_role";

grant update on table "public"."NEW_projects" to "service_role";

create policy "Enable read access for all users"
on "public"."NEW_projects"
as permissive
for select
to public
using (true);


create policy "Enable insert for authenticated users only"
on "public"."github_profiles"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."github_profiles"
as permissive
for select
to public
using (true);


create policy "Users can delete their own projects"
on "public"."projects"
as permissive
for delete
to public
using (((auth.uid())::text = user_id));


create policy "Users can insert their own projects"
on "public"."projects"
as permissive
for insert
to public
with check (((auth.uid())::text = user_id));


create policy "Users can update their own projects"
on "public"."projects"
as permissive
for update
to public
using (((auth.uid())::text = user_id));


create policy "Users can view their own projects"
on "public"."projects"
as permissive
for select
to public
using (((auth.uid())::text = user_id));


create policy "Users can create attacks for their projects"
on "public"."attacks"
as permissive
for insert
to public
with check ((EXISTS ( SELECT 1
   FROM projects
  WHERE ((projects.id = attacks.project_id) AND (projects.user_id = (auth.uid())::text)))));


create policy "Users can view attacks for their projects"
on "public"."attacks"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM projects
  WHERE ((projects.id = attacks.project_id) AND (projects.user_id = (auth.uid())::text)))));


create policy "Users can delete their own project env vars"
on "public"."project_env_vars"
as permissive
for delete
to public
using ((EXISTS ( SELECT 1
   FROM projects
  WHERE ((projects.id = project_env_vars.project_id) AND (projects.user_id = (auth.uid())::text)))));


create policy "Users can insert their own project env vars"
on "public"."project_env_vars"
as permissive
for insert
to public
with check ((EXISTS ( SELECT 1
   FROM projects
  WHERE ((projects.id = project_env_vars.project_id) AND (projects.user_id = (auth.uid())::text)))));


create policy "Users can update their own project env vars"
on "public"."project_env_vars"
as permissive
for update
to public
using ((EXISTS ( SELECT 1
   FROM projects
  WHERE ((projects.id = project_env_vars.project_id) AND (projects.user_id = (auth.uid())::text)))));


create policy "Users can view their own project env vars"
on "public"."project_env_vars"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM projects
  WHERE ((projects.id = project_env_vars.project_id) AND (projects.user_id = (auth.uid())::text)))));


create policy "Users can create scans for their own projects"
on "public"."scans"
as permissive
for insert
to public
with check ((EXISTS ( SELECT 1
   FROM projects
  WHERE (((projects.id)::text = (scans.project_id)::text) AND (projects.user_id = (auth.uid())::text)))));


create policy "Users can create scans for their projects"
on "public"."scans"
as permissive
for insert
to public
with check ((project_id IN ( SELECT projects.id
   FROM projects
  WHERE (projects.user_id = (auth.jwt() ->> 'sub'::text)))));


create policy "Users can update their own scans"
on "public"."scans"
as permissive
for update
to public
using ((project_id IN ( SELECT projects.id
   FROM projects
  WHERE (projects.user_id = (auth.jwt() ->> 'sub'::text)))))
with check ((project_id IN ( SELECT projects.id
   FROM projects
  WHERE (projects.user_id = (auth.jwt() ->> 'sub'::text)))));


create policy "Users can view their own project scans"
on "public"."scans"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM projects
  WHERE (((projects.id)::text = (scans.project_id)::text) AND (projects.user_id = (auth.uid())::text)))));


create policy "Users can view their own scans"
on "public"."scans"
as permissive
for select
to public
using ((project_id IN ( SELECT projects.id
   FROM projects
  WHERE (projects.user_id = (auth.jwt() ->> 'sub'::text)))));


CREATE TRIGGER set_updated_at BEFORE UPDATE ON public."NEW_projects" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


