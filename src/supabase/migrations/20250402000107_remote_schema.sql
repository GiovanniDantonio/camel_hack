alter table "auth"."users" add column "github_access_token" text;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();
ALTER TABLE "auth"."users" DISABLE TRIGGER "on_auth_user_created";


alter table "storage"."objects" add column "user_metadata" jsonb;

alter table "storage"."s3_multipart_uploads" add column "user_metadata" jsonb;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION storage.operation()
 RETURNS text
 LANGUAGE plpgsql
 STABLE
AS $function$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$function$
;


