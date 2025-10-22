import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Button,
} from '@react-email/components';

interface PasswordResetEmailProps {
  username: string;
  resetUrl: string;
}

export default function PasswordResetEmail({ username, resetUrl }: PasswordResetEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Reset Your Password - Truth Link</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: 'https://fonts.googleapis.com/css?family=Roboto:400,700',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Reset your Truth Link password</Preview>
      <Section>
        <Row>
          <Heading as="h2">Hello {username},</Heading>
        </Row>
        <Row>
          <Text>
            We received a request to reset your password for your Truth Link account.
          </Text>
        </Row>
        <Row>
          <Text>
            Click the button below to reset your password. This link will expire in 1 hour.
          </Text>
        </Row>
        <Row>
          <Button
            href={resetUrl}
            style={{
              color: '#000',
              backgroundColor: '#fbbf24',
              borderRadius: '5px',
              padding: '10px 20px',
              textDecoration: 'none',
              display: 'inline-block',
              fontWeight: 'bold',
            }}
          >
            Reset Password
          </Button>
        </Row>
        <Row>
          <Text>
            If you didn't request this password reset, please ignore this email.
          </Text>
        </Row>
        <Row>
          <Text>
            Best regards,<br />
            Truth Link Team
          </Text>
        </Row>
      </Section>
    </Html>
  );
}
