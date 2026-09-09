import { useContactInfo } from '../../api/hooks';
import { SectionWrapper } from '../layout/SectionWrapper';
import { ContactForm } from './ContactForm';
import { ContactInfo } from './ContactInfo';

export function Contact() {
  const { data: info } = useContactInfo();

  return (
    <SectionWrapper id="contact" index={7} title="Contact" subtitle="Une idee de projet ? Discutons-en">
      <div className="grid md:grid-cols-2 gap-10 items-start">
        <ContactInfo />
        {info?.form_active !== false && <ContactForm />}
      </div>
    </SectionWrapper>
  );
}
