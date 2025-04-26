alter table "public"."NEW_projects" drop constraint "projects_user_id_fkey";

alter table "public"."NEW_projects" drop constraint "projects_pkey1";

drop index if exists "public"."projects_pkey1";

alter table "public"."NEW_projects" add column "env_vars" jsonb default '{}'::jsonb;

alter table "public"."NEW_projects" add column "target_url" text;

CREATE UNIQUE INDEX "NEW_projects_pkey" ON public."NEW_projects" USING btree (id);

alter table "public"."NEW_projects" add constraint "NEW_projects_pkey" PRIMARY KEY using index "NEW_projects_pkey";

alter table "public"."NEW_projects" add constraint "NEW_projects_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."NEW_projects" validate constraint "NEW_projects_user_id_fkey";

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

create policy "Enable delete for authenticated users only"
on "public"."NEW_projects"
as permissive
for delete
to authenticated
using ((auth.uid() IS NOT NULL));


create policy "Enable insert for authenticated users only"
on "public"."NEW_projects"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable update for authenticated users only"
on "public"."NEW_projects"
as permissive
for update
to authenticated
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));



