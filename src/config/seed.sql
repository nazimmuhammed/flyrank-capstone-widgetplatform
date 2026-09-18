INSERT INTO tenants (name, email)
VALUES ('Demo Company', 'demo@flyrank.local')
ON CONFLICT (email) DO NOTHING;

INSERT INTO widgets (
    tenant_id,
    type,
    title,
    description,
    form_fields,
    button_text,
    display_options
)
SELECT
    id,
    'signup',
    'Get in touch',
    'Send us your details and we will contact you.',
    '[{"name":"name","label":"Name","type":"text","required":true},{"name":"email","label":"Email","type":"email","required":true},{"name":"message","label":"Message","type":"textarea","required":false}]'::jsonb,
    'Submit',
    '{"position":"bottom-right"}'::jsonb
FROM tenants
WHERE email = 'demo@flyrank.local'
AND NOT EXISTS (
    SELECT 1 FROM widgets
    WHERE tenant_id = tenants.id
);