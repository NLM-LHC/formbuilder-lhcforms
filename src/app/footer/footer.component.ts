import { Component, OnInit } from '@angular/core';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-footer',
  template: `
    <div id="fine-print">
      <ul class="horz-list">
        <li><a title="NLM copyright information"
               href="http://www.nlm.nih.gov/copyright.html">Copyright</a></li>
        <li><a title="NLM privacy policy"
               href="http://www.nlm.nih.gov/privacy.html">Privacy</a></li>
        <li><a title="NLM accessibility"
               href="http://www.nlm.nih.gov/accessibility.html" >Accessibility</a></li>
        <li><a title="NIH Freedom of Information Act office"
               href="http://www.nih.gov/icd/od/foia/index.htm"
        >Freedom of Information Act</a></li>
        <li class="last-item"><a href="https://lhncbc.nlm.nih.gov/contact-us"
        >Contact Us</a></li>
      </ul>
      <ul class="horz-list">
        <li><a title="U.S. National Library of Medicine"
               href="http://www.nlm.nih.gov/"
        >U.S. National Library of Medicine</a></li>
        <li><a title="U.S. National Institutes of Health" href="http://www.nih.gov/"
        >U.S. National Institutes of Health</a></li>
        <li><a title="U.S. Department of Health and Human
    Services"  href="http://www.hhs.gov/"
        >U.S. Department of Health and Human Services</a></li>
        <li class="last-item"><a title="USA.gov" href="http://www.usa.gov/"><mat-icon
          svgIcon="USAgov" alt="USA.gov" id="usagov"></mat-icon></a></li>
      </ul>
    </div>
  `,
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(private iconRegistry: MatIconRegistry,
              private sanitizer: DomSanitizer) {
    this.iconRegistry.addSvgIcon('USAgov',
      this.sanitizer.bypassSecurityTrustResourceUrl('../../assets/images/USAgov.svg'));
  }

  ngOnInit(): void {
  }

}
