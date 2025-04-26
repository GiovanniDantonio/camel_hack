drop trigger if exists "update_projects_updated_at" on "public"."projects";

drop policy "Users can delete their own projects" on "public"."projects";

drop policy "Users can insert their own projects" on "public"."projects";

drop policy "Users can update their own projects" on "public"."projects";

drop policy "Users can view their own projects" on "public"."projects";

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

alter table "public"."projects" drop constraint "projects_user_id_repository_id_key";

alter table "public"."attacks" drop constraint "attacks_project_id_fkey";

alter table "public"."code_files" drop constraint "code_files_project_id_fkey";

alter table "public"."project_env_vars" drop constraint "project_env_vars_project_id_fkey";

alter table "public"."scans" drop constraint "scans_project_id_fkey";

alter table "public"."vulnerabilities" drop constraint "vulnerabilities_project_id_fkey";

alter table "public"."projects" drop constraint "projects_pkey";

drop index if exists "public"."projects_pkey";

drop index if exists "public"."projects_user_id_idx";

drop index if exists "public"."projects_user_id_repository_id_key";

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


alter table "public"."projects" drop column "metadata";

alter table "public"."projects" drop column "name";

alter table "public"."projects" drop column "repository";

alter table "public"."projects" drop column "repository_is_private";

alter table "public"."projects" drop column "target_url";

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

alter table "public"."projects" alter column "user_id" drop not null;

alter table "public"."projects" alter column "user_id" set data type uuid using "user_id"::uuid;

alter table "public"."projects" enable row level security;

CREATE UNIQUE INDEX projects_pkey1 ON public.projects USING btree (id);

CREATE UNIQUE INDEX projects_pkey ON public."OLD_projects" USING btree (id);

CREATE INDEX projects_user_id_idx ON public."OLD_projects" USING btree (user_id);

CREATE UNIQUE INDEX projects_user_id_repository_id_key ON public."OLD_projects" USING btree (user_id, repository_id);

alter table "public"."OLD_projects" add constraint "projects_pkey" PRIMARY KEY using index "projects_pkey";

alter table "public"."projects" add constraint "projects_pkey1" PRIMARY KEY using index "projects_pkey1";

alter table "public"."OLD_projects" add constraint "projects_user_id_repository_id_key" UNIQUE using index "projects_user_id_repository_id_key";

alter table "public"."projects" add constraint "projects_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."projects" validate constraint "projects_user_id_fkey";

alter table "public"."attacks" add constraint "attacks_project_id_fkey" FOREIGN KEY (project_id) REFERENCES "OLD_projects"(id) ON DELETE CASCADE not valid;

alter table "public"."attacks" validate constraint "attacks_project_id_fkey";

alter table "public"."code_files" add constraint "code_files_project_id_fkey" FOREIGN KEY (project_id) REFERENCES "OLD_projects"(id) ON DELETE CASCADE not valid;

alter table "public"."code_files" validate constraint "code_files_project_id_fkey";

alter table "public"."project_env_vars" add constraint "project_env_vars_project_id_fkey" FOREIGN KEY (project_id) REFERENCES "OLD_projects"(id) ON DELETE CASCADE not valid;

alter table "public"."project_env_vars" validate constraint "project_env_vars_project_id_fkey";

alter table "public"."scans" add constraint "scans_project_id_fkey" FOREIGN KEY (project_id) REFERENCES "OLD_projects"(id) ON DELETE CASCADE not valid;

alter table "public"."scans" validate constraint "scans_project_id_fkey";

alter table "public"."vulnerabilities" add constraint "vulnerabilities_project_id_fkey" FOREIGN KEY (project_id) REFERENCES "OLD_projects"(id) ON DELETE CASCADE not valid;

alter table "public"."vulnerabilities" validate constraint "vulnerabilities_project_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  new.updated_at = now();
  return new;
end;
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


create policy "Enable read access for all users"
on "public"."projects"
as permissive
for select
to public
using (true);


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


create policy "Users can create scans for their own projects"
on "public"."scans"
as permissive
for insert
to public
with check ((EXISTS ( SELECT 1
   FROM "OLD_projects"
  WHERE ((("OLD_projects".id)::text = (scans.project_id)::text) AND ("OLD_projects".user_id = (auth.uid())::text)))));


create policy "Users can create scans for their projects"
on "public"."scans"
as permissive
for insert
to public
with check ((project_id IN ( SELECT "OLD_projects".id
   FROM "OLD_projects"
  WHERE ("OLD_projects".user_id = (auth.jwt() ->> 'sub'::text)))));


create policy "Users can update their own scans"
on "public"."scans"
as permissive
for update
to public
using ((project_id IN ( SELECT "OLD_projects".id
   FROM "OLD_projects"
  WHERE ("OLD_projects".user_id = (auth.jwt() ->> 'sub'::text)))))
with check ((project_id IN ( SELECT "OLD_projects".id
   FROM "OLD_projects"
  WHERE ("OLD_projects".user_id = (auth.jwt() ->> 'sub'::text)))));


create policy "Users can view their own project scans"
on "public"."scans"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM "OLD_projects"
  WHERE ((("OLD_projects".id)::text = (scans.project_id)::text) AND ("OLD_projects".user_id = (auth.uid())::text)))));


create policy "Users can view their own scans"
on "public"."scans"
as permissive
for select
to public
using ((project_id IN ( SELECT "OLD_projects".id
   FROM "OLD_projects"
  WHERE ("OLD_projects".user_id = (auth.jwt() ->> 'sub'::text)))));


CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public."OLD_projects" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


